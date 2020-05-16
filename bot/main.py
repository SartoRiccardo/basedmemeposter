from modules import account, waiter
from apis import based, imgur, reddit, twitter, instagram
from config import config

import urllib3
import datetime
import time

import pprint


def gather_posts():
    return []


def waitfor(seconds):
    thread = waiter.Waiter(datetime.datetime.now() + datetime.timedelta(seconds=seconds))
    thread.start()
    thread.join()


def start_posting(accounts, stop_at):
    pass


def main():
    pool = urllib3.PoolManager()

    account_credentials = config("instagram", "accounts")
    accounts = [account.Account(
        cred["username"], cred["password"], pool
    ) for cred in account_credentials]

    while True:
        posts = gather_posts()
        for p in posts:
            pass  # send_posts(posts)

        for acct in accounts:
            acct.start()

        # waitfor(60 * 60 * 24)

        for acct in accounts:
            acct.stop_posting()
            acct.join()


def othermain():
    top = instagram.getPostsFromUser("basedmemeposter")
    [pprint.pprint(t.toJson()) for t in top]


if __name__ == '__main__':
    try:
        othermain()
        # main()
    except Exception as ex:
        raise ex
