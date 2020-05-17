import urllib3
import datetime
import json
# Own modules
from config import config
import apis.mastermemed.account
import apis.mastermemed.post
import apis.mastermemed.source


class Client:
    BASED_URL = config("mastermemed", "url")

    def __init__(self, client_id):
        """
        A class to make request to the Based API.
        :param client_id: str: The Based access token
        """
        self.client_id = client_id
        self.http = urllib3.PoolManager()

    def __get(self, endpoint, params=None):
        url = f"{Client.BASED_URL}{endpoint}"
        return self.http.request(
            "GET", url,
            fields=params,
            headers={
                "X-Authorization": f"Bearer {self.client_id}"
            }
        )

    def __post(self, endpoint, data):
        return self.http.request(
            "POST", f"{Client.BASED_URL}{endpoint}",
            body=data,
            headers={
                "X-Authorization": f"Bearer {self.client_id}",
                "Content-Type": "application/json",
            },
        )

    def __put(self, endpoint, data):
        return self.http.request(
            "PUT", f"{Client.BASED_URL}{endpoint}",
            body=data,
            headers={
                "X-Authorization": f"Bearer {self.client_id}",
                "Content-Type": "application/json",
            },
        )

    def __delete(self, endpoint):
        return self.http.request(
            "POST", f"{Client.BASED_URL}{endpoint}",
            headers={
                "X-Authorization": f"Bearer {self.client_id}",
            },
        )

    def account(self, id):
        """
        Fetches a given account.
        :param id: int: An account ID.
        :return: mastermemed.Account
        """
        url = f"/accounts/{id}"
        response = self.__get(url)
        if response.status != 200:
            return None

        raw_account = json.loads(response.data.decode("utf-8"))["data"]
        account = apis.mastermemed.account.Account(
            raw_account["username"],
            raw_account["password"],
            raw_account["startTime"],
            raw_account["endTime"],
            id=raw_account["id"],
        )
        return account

    def accounts(self):
        """
        Fetches a given account.
        :return: mastermemed.Account[]
        """
        url = f"/accounts"
        response = self.__get(url)
        if response.status != 200:
            return None

        raw_accounts = json.loads(response.data.decode("utf-8"))["data"]
        accounts = []
        for account in raw_accounts:
            new_account = apis.mastermemed.account.Account(
                                account["username"],
                                account["password"],
                                account["startTime"],
                                account["endTime"],
                                id=account["id"],
                            )
            accounts.append(new_account)
        return accounts

    def post(self, id):
        """
        Fetches a given account.
        :param id: int: An account ID.
        :return: mastermemed.Account
        """
        url = f"/posts/{id}"
        response = self.__get(url)
        if response.status != 200:
            return None

        raw_post = json.loads(response.data.decode("utf-8"))["data"]
        post = apis.mastermemed.post.Post(
            raw_post["platform"],
            raw_post["original_id"],
            raw_post["original_link"],
            raw_post["image_url"],
            raw_post["thumbnail"],
            id=raw_post["id"],
        )
        return post

    def addPost(self, post):
        """
        Submits a post.
        :param post: mastermemed.Post: The post to submit.
        :return: Post: The submitted post, with an appropriate ID.
        """
        data = post.toJson()
        replacement_keys = [
            ("original_id", "originalId"),
            ("original_link", "originalLink"),
            ("content_url", "contentUrl"),
        ]
        for key, replacement in replacement_keys:
            data[replacement] = data[key]
            del data[key]

        response = self.__post("/posts", json.dumps(data))
        return response.status == 201

    def sources(self):
        response = self.__get("/sources")
        if response.status != 200:
            return None

        raw_sources = json.loads(response.data.decode())["data"]
        sources = []
        for raw_source in raw_sources:
            s = apis.mastermemed.source.Source(
                raw_source["name"],
                raw_source["platform"],
                id=raw_source["id"],
            )
            sources.append(s)
        return sources

    def addLog(self, level, message, account=None):
        data = {
            "level": level,
            "message": message,
        }
        if account:
            data["account"] = account.id
        response = self.__post("/logs", json.dumps(data))
        return response == 201

    def debug(self, message, account=None):
        """
        Shortcut for addLog("warning", *args, **kwargs)
        :param message: str: The message to log.
        :param account: mastermemed.Account: The account this log references.
        """
        self.addLog("debug", message, account)

    def info(self, message, account=None):
        """
        Shortcut for addLog("info", *args, **kwargs)
        :param message: str: The message to log.
        :param account: mastermemed.Account: The account this log references.
        """
        self.addLog("info", message, account)

    def warn(self, message, account=None):
        """
        Shortcut for addLog("warning", *args, **kwargs)
        :param message: str: The message to log.
        :param account: mastermemed.Account: The account this log references.
        """
        self.addLog("warning", message, account)

    def error(self, message, account=None):
        """
        Shortcut for addLog("error", *args, **kwargs)
        :param message: str: The message to log.
        :param account: mastermemed.Account: The account this log references.
        """
        self.addLog("error", message, account)

    def critical(self, message, account=None):
        """
        Shortcut for addLog("critical", *args, **kwargs)
        :param message: str: The message to log.
        :param account: mastermemed.Account: The account this log references.
        """
        self.addLog("critical", message, account)
