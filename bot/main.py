#!/usr/bin/env python3.7
import urllib3
import traceback
from copy import copy
from datetime import datetime, timedelta, timezone
from twitter.error import TwitterError
from random import randint
import math
import os
# Own modules
from modules import account, threads, counter
from apis import mastermemed, imgur, reddit, twitter, instagram
from config import config


mastermemed_client = None


def gatherPosts():
    mastermemed_client.info("Started gathering posts")
    all_sources = mastermemed_client.sources()
    sources = {}
    for source in all_sources:
        if source.platform in sources:
            sources[source.platform].append(source.name)
        else:
            sources[source.platform] = [source.name]

    posts = []

    try:
        posts += imgur.topGalleries()
        mastermemed_client.debug(f"Gathered {len(posts)} posts from Imgur")
    except Exception as exc:
        mastermemed_client.warning(
            f"Error while gathering posts from Imgur: f{exc}"
        )

    if "reddit" in sources:
        for subreddit in sources["reddit"]:
            try:
                new_posts = reddit.topSubImagePosts(subreddit)
                posts += new_posts
                mastermemed_client.debug(f"(Reddit) Gathered {len(new_posts)} posts from \"r/{subreddit}\"")
            except Exception as exc:
                mastermemed_client.warning(
                    f"(Reddit) Error while gathering \"r/{subreddit}\": f{exc}"
                )

    if "twitter" in sources:
        for user in sources["twitter"]:
            try:
                new_posts = twitter.userImageStatuses(user)
                posts += new_posts
                mastermemed_client.debug(f"(Twitter) Gathered {len(new_posts)} posts from \"{user}\"")
            except TwitterError as exc:
                mastermemed_client.warning(
                    f"(Twitter) Error while gathering \"{user}\": f{exc}"
                )

    if "instagram" in sources:
        for user in sources["instagram"]:
            try:
                new_posts = instagram.getPostsFromUser(user)
                posts += new_posts
                mastermemed_client.debug(f"(Instagram) Gathered {len(new_posts)} posts from \"{user}\"")
            except Exception as exc:
                mastermemed_client.warning(
                    f"(Instagram) Error while gathering \"{user}\": f{exc}"
                )

    mastermemed_client.info("Finished gathering posts")
    return posts


def uploadPosts(posts):
    mastermemed_client.info("Started uploading posts")
    uploaders_count = 10
    successes = counter.Counter()
    uploaders = [
        threads.PostUploader(mastermemed_client, successes)
        for _ in range(uploaders_count)
    ]

    i = 0
    requests_per_uploader = math.ceil(len(posts)/uploaders_count)
    for uploader in uploaders:
        for _ in range(requests_per_uploader):
            if i >= len(posts):
                break
            uploader.addPost(posts[i])
            i += 1
        uploader.start()

    for uploader in uploaders:
        uploader.join()

    mastermemed_client.info(f"Finished uploading {successes.value()} posts")


MISSING_POST_CHANCE = 1/15
MAX_TRIES = 50
POST_EVERY_NOISE = 0.3


def scheduleRandomPosts():
    post_every = config("mastermemed", "post-every") * 60
    mastermemed_client.info("Scheduling posts for the day")
    accounts = mastermemed_client.accounts()

    scheduled_posts = {}
    for acct in accounts:
        schedules = mastermemed_client.schedules(
            account=acct.id,
            after=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        )
        scheduled_posts[acct.id] = [s.post.id for s in schedules]

    days_ago = (datetime.now(timezone.utc) - timedelta(days=config("mastermemed", "days-before-check"))) \
        .strftime("%Y-%m-%d")
    post_data = mastermemed_client.posts(after=days_ago)
    per_page, total = post_data.per_page, post_data.total

    unused_posts = []
    current_date = datetime.now(timezone.utc) + timedelta(minutes=20)
    for acct in accounts:
        end_timedelta = timedelta(days=1)
        posting_time = copy(current_date)

        current_tries = 0
        unused_posts_i = len(unused_posts) - 1
        while posting_time < current_date + end_timedelta and current_tries < MAX_TRIES:
            if acct.inTimeRange(posting_time):
                from_cache = False
                if unused_posts_i >= 0:
                    from_cache = True
                    post = unused_posts[unused_posts_i]
                    unused_posts_i -= 1
                else:
                    random_post_i = randint(0, total-1)
                    page = math.floor(random_post_i/per_page)
                    random_post_i -= page * per_page
                    post = mastermemed_client.posts(after=days_ago, page=page) \
                        .posts[random_post_i]

                if post.id not in scheduled_posts[acct.id]:
                    mastermemed_client.addSchedule(acct, post, posting_time)
                if not from_cache and post.id not in [p.id for p in unused_posts]:
                    unused_posts.append(post)
                    current_tries += 1

            posting_time += timedelta(
                seconds=randint(
                    int(post_every * (1-POST_EVERY_NOISE)),
                    int(post_every * (1+POST_EVERY_NOISE)),
                )
            )

    mastermemed_client.info("Posts scheduled")


now = datetime.now(tz=timezone.utc)


def dayChanged():
    global now
    now_prev = now
    now = datetime.now(tz=timezone.utc)
    return now_prev.day != now.day


def main():
    global mastermemed_client

    mastermemed_client = mastermemed.Client(config("mastermemed", "client-id"))
    pool = urllib3.PoolManager()

    first_run = True
    while True:
        if not first_run:
            posts = gatherPosts()
            uploadPosts(posts)
            scheduleRandomPosts()

        account_data = mastermemed_client.accounts()
        accounts = []
        for acct in account_data:
            account_poster = account.Account(
                acct.id,
                mastermemed_client,
                pool=pool,
            )
            account_poster.setName(acct.username)
            account_poster.setLogger(mastermemed_client)
            accounts.append(account_poster)

        mastermemed_client.info("Starting accounts")
        for acct in accounts:
            acct.start()

        threads.waituntil(dayChanged, 60)

        mastermemed_client.info("Stopping accounts")
        for acct in accounts:
            acct.stopPosting()
            acct.join()
        mastermemed_client.info("Accounts stopped")

        first_run = False


if __name__ == '__main__':
    try:
        main()
    except Exception:
        error = traceback.format_exc()

        if not os.path.exists("logs"):
            os.mkdir("logs")
        log = open("logs/errors.log", "a")
        log.write(error)
        log.close()

        mastermemed_client.critical(error)
