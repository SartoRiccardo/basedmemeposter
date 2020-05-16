import urllib3
import datetime
# Own modules
from modules import account, waiter
from apis import based, imgur, reddit, twitter, instagram
from config import config
import time
# Cryptography
from base64 import b64decode
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto import Random
# Debug
import pprint


PRIVATE_KEY = config("mastermemed", "private-key")


def decrypt(encrypted):
    key = RSA.importKey(PRIVATE_KEY)
    sentinel = Random.new().read(256)
    cipher = PKCS1_v1_5.new(key)
    return cipher.decrypt(b64decode(encrypted), sentinel).decode("utf-8")


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
    pswd = "loRkQqnEPQRb3ScqNHCjacopsgm7ZG8Q1qvHKKVCxBhY9qOM0rN2nom18+2Bf1ACdnoPEDNHezJyXCdINrZFneW5JgvpUDjW5Kodan+sWVeGn3GpINVBrIOO6zZyRVWiTiuBE8cgkCKXLUfXUxpV6XUUexnCJGo+30+paRbN/HE="

    assert decrypt(pswd) == "changed1234"


if __name__ == '__main__':
    try:
        othermain()
        # main()
    except Exception as ex:
        raise ex
