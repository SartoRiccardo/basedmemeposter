from modules import account
import urllib3


pool = urllib3.PoolManager()
accts = [account.Account("", "", pool) for _ in range(5)]

for a in accts:
    a.start()

for a in accts:
    a.join()


