import urllib3
import datetime
from twitter.error import TwitterError
import time
import math
# Own modules
from modules import account, threads
from apis import mastermemed, imgur, reddit, twitter, instagram
from config import config
# Debug
import pprint


mastermemed_client = None


def gather_posts():
    all_sources = mastermemed_client.sources()
    sources = {}
    for source in all_sources:
        if source.platform in sources:
            sources[source.platform].append(source.name)
        else:
            sources[source.platform] = [source.name]

    posts = []

    mastermemed_client.info(f"Gathering posts from Imgur")
    try:
        posts += imgur.topGalleries()
    except Exception as exc:
        mastermemed_client.warn(
            f"Error while gathering posts from Imgur: f{exc}"
        )

    if "reddit" in sources:
        for subreddit in sources["reddit"]:
            mastermemed_client.info(f"Gathering posts from \"r/{subreddit}\"")
            try:
                posts += reddit.topSubImagePosts(subreddit)
            except Exception as exc:
                mastermemed_client.warn(
                    f"Error while gathering \"r/{subreddit}\": f{exc}"
                )

    if "twitter" in sources:
        for user in sources["twitter"]:
            mastermemed_client.info(f"Gathering posts from \"{user}\" (twitter)")
            try:
                posts += twitter.userImageStatuses(user)
            except TwitterError as exc:
                mastermemed_client.warn(
                    f"Error while gathering \"{user}\" (twitter): f{exc}"
                )

    if "instagram" in sources:
        for user in sources["instagram"]:
            mastermemed_client.info(f"Gathering posts from {user} (instagram)")
            try:
                posts += instagram.getPostsFromUser(user)
            except Exception as exc:
                mastermemed_client.warn(
                    f"Error while gathering \"{user}\" (instagram): f{exc}"
                )

    return posts


def upload_posts(posts):
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


def waitfor(seconds):
    thread = threads.Waiter(datetime.datetime.now() + datetime.timedelta(seconds=seconds))
    thread.start()
    thread.join()


def start_posting(accounts, stop_at):
    pass


def main():
    global mastermemed_client

    mastermemed_client = mastermemed.Client(config("mastermemed", "client-id"))

    while True:
        posts = gather_posts()
        for p in posts:
            mastermemed_client.addPost(p)

        account_data = mastermemed_client.accounts()
        accounts = []
        for acct in account_data:
            accounts.append(
                account.Account(acct.username, acct.password)
            )

        for acct in accounts:
            acct.start()

        # waitfor(60 * 60 * 24)

        for acct in accounts:
            acct.stopPosting()
            acct.join()


def othermain():
    global mastermemed_client

    mastermemed_client = mastermemed.Client(config("mastermemed", "client-id"))

    posts = gather_posts()
    upload_posts(posts)


if __name__ == '__main__':
    try:
        othermain()
        # main()
    except Exception as ex:
        raise ex
