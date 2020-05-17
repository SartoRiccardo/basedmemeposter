import urllib3
import datetime
from twitter.error import TwitterError
# Own modules
from modules import account, waiter
from apis import mastermemed, imgur, reddit, twitter, instagram
from config import config
import time
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

    posts += imgur.topGalleries()

    print("Gathering reddit sources...")
    if "reddit" in sources:
        for subreddit in sources["reddit"]:
            posts += reddit.topSubImagePosts(subreddit)

    print("Gathering twitter sources...")
    if "twitter" in sources:
        for user in sources["twitter"]:
            try:
                posts += twitter.userImageStatuses(user)
            except TwitterError:
                print(f"There was a problem gathering {user}'s posts.")

    print("Gathering instagram sources...")
    if "instagram" in sources:
        for user in sources["instagram"]:
            posts += instagram.getPostsFromUser(user)

    return posts


def waitfor(seconds):
    thread = waiter.Waiter(datetime.datetime.now() + datetime.timedelta(seconds=seconds))
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
    [mastermemed_client.addPost(p) for p in posts]


if __name__ == '__main__':
    try:
        othermain()
        # main()
    except Exception as ex:
        raise ex
