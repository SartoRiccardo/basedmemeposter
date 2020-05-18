import urllib3
import traceback
from copy import copy
from datetime import datetime, timedelta, timezone
from twitter.error import TwitterError
from random import randint
import math
# Own modules
from modules import account, threads
from apis import mastermemed, imgur, reddit, twitter, instagram
from config import config


mastermemed_client = None


def gatherPosts():
    all_sources = mastermemed_client.sources()
    sources = {}
    for source in all_sources:
        if source.platform in sources:
            sources[source.platform].append(source.name)
        else:
            sources[source.platform] = [source.name]

    posts = []

    mastermemed_client.debug(f"Gathering posts from Imgur")
    try:
        posts += imgur.topGalleries()
    except Exception as exc:
        mastermemed_client.warning(
            f"Error while gathering posts from Imgur: f{exc}"
        )

    if "reddit" in sources:
        for subreddit in sources["reddit"]:
            mastermemed_client.debug(f"Gathering posts from \"r/{subreddit}\"")
            try:
                posts += reddit.topSubImagePosts(subreddit)
            except Exception as exc:
                mastermemed_client.warning(
                    f"Error while gathering \"r/{subreddit}\": f{exc}"
                )

    if "twitter" in sources:
        for user in sources["twitter"]:
            mastermemed_client.debug(f"Gathering posts from \"{user}\" (twitter)")
            try:
                posts += twitter.userImageStatuses(user)
            except TwitterError as exc:
                mastermemed_client.warning(
                    f"Error while gathering \"{user}\" (twitter): f{exc}"
                )

    if "instagram" in sources:
        for user in sources["instagram"]:
            mastermemed_client.debug(f"Gathering posts from {user} (instagram)")
            try:
                posts += instagram.getPostsFromUser(user)
            except Exception as exc:
                mastermemed_client.warning(
                    f"Error while gathering \"{user}\" (instagram): f{exc}"
                )

    return posts


def uploadPosts(posts):
    uploaders_count = 10
    uploaders = [threads.PostUploader(mastermemed_client) for _ in range(uploaders_count)]

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


def getRandomCaption():
    try:
        data = mastermemed_client.captionData()
        caption_count, captions_per_page = data["total"], data["per_page"]
        caption_i = randint(0, caption_count-1)
        caption_page = math.floor(caption_i/captions_per_page)
        caption_i -= caption_page*captions_per_page

        return mastermemed_client.captions(page=caption_page)[caption_i].text
    except Exception as exc:
        return ""


MISSING_POST_CHANCE = 1/15
MAX_TRIES = 50
POST_EVERY = 45 * 60
POST_EVERY_NOISE = 0.3


def scheduleRandomPosts():
    accounts = mastermemed_client.accounts()

    scheduled_posts = {}
    for acct in accounts:
        schedules = mastermemed_client.schedules(
            account=acct.id,
            after=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        )
        scheduled_posts[acct.id] = [s.post.id for s in schedules]

    five_days_ago = (datetime.now(timezone.utc) - timedelta(days=5)).strftime("%Y-%m-%d")
    post_data = mastermemed_client.posts(after=five_days_ago)
    per_page, total = post_data.per_page, post_data.total

    unused_posts = []
    current_date = datetime.now(timezone.utc)
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
                    post = mastermemed_client.posts(after=five_days_ago, page=page) \
                        .posts[random_post_i]

                if post.id not in scheduled_posts[acct.id]:
                    mastermemed_client.addSchedule(acct, post, posting_time)
                if not from_cache and post.id not in [p.id for p in unused_posts]:
                    unused_posts.append(post)
                    current_tries += 1

            posting_time += timedelta(
                seconds=randint(
                    int(POST_EVERY * (1-POST_EVERY_NOISE)),
                    int(POST_EVERY * (1+POST_EVERY_NOISE)),
                )
            )


def main():
    global mastermemed_client

    mastermemed_client = mastermemed.Client(config("mastermemed", "client-id"))
    pool = urllib3.PoolManager()

    while True:
        posts = gatherPosts()
        uploadPosts(posts)
        scheduleRandomPosts()

        account_data = mastermemed_client.accounts()
        accounts = []
        for acct in account_data:
            schedule = mastermemed_client.schedules(account=acct, only_scheduled=True)
            account_poster = account.Account(
                acct.id,
                acct.username,
                acct.password,
                schedule,
                pool=pool,
                getCaptionCallback=getRandomCaption
            )
            account_poster.setName(acct.username)
            account_poster.setLogger(mastermemed_client)
            accounts.append(account_poster)

        for acct in accounts:
            acct.start()

        threads.waitfor(60 * 60 * 24)

        for acct in accounts:
            acct.stopPosting()
            acct.join()


def othermain():
    global mastermemed_client

    mastermemed_client = mastermemed.Client(config("mastermemed", "client-id"))

    scheduleRandomPosts()


if __name__ == '__main__':
    try:
        # main()
        othermain()
    except Exception:
        error = traceback.format_exc()
        log = open("logs/errors.log", "wa")
        log.write(error)
        log.close()
        mastermemed_client.critical(error)
