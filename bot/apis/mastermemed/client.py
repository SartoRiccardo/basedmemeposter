import urllib3
import time
import json
from urllib.parse import urlencode
# Own modules
from config import config
import apis.mastermemed.account
import apis.mastermemed.post
import apis.mastermemed.source
import apis.mastermemed.caption
import apis.mastermemed.schedule


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

    def posts(self, after=None, platforms=None, page=None):
        url_querystrings = []
        if after:
            url_querystrings.append(urlencode({"after": after}))
        if platforms:
            url_querystrings += [
                urlencode({"platforms[]": platform})
                for platform in platforms
            ]
        if page:
            url_querystrings.append(urlencode({"page": page}))
        response = self.__get("/posts?" + "&".join(url_querystrings))
        if response.status != 200:
            return None

        raw_posts = json.loads(response.data.decode())["data"]
        posts = []
        for raw_post in raw_posts["data"]:
            posts.append(apis.mastermemed.post.Post(
                raw_post["platform"],
                raw_post["originalId"],
                raw_post["originalLink"],
                raw_post["contentUrl"],
                raw_post["thumbnail"],
                id=raw_post["id"],
            ))

        return apis.mastermemed.post.PostCollection(
            posts, raw_posts["per_page"], raw_posts["total"]
        )

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
            raw_post["originalId"],
            raw_post["originalLink"],
            raw_post["contentUrl"],
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

    def captionData(self):
        response = self.__get("/captions")
        if response.status == 200:
            return json.loads(response.data.decode())["data"]

    def captions(self, page=1):
        response = self.__get("/captions", {"page": page})
        if response.status != 200:
            return None

        raw_captions = json.loads(response.data.decode())["data"]["data"]
        captions = []
        for raw_caption in raw_captions:
            captions.append(apis.mastermemed.caption.Caption(
                raw_caption["text"],
                id=raw_caption["id"],
            ))
        return captions

    def schedules(self, account=None, only_scheduled=False, after=None):
        params = {}
        if account:
            params["account"] = account if isinstance(account, int) else account.id
        if only_scheduled:
            params["onlyScheduled"] = True
        if after:
            params["after"] = after
        response = self.__get("/schedule", params)
        if response.status != 200:
            return None

        raw_schedules = json.loads(response.data.decode())["data"]
        schedules = []
        for raw_schedule in raw_schedules:
            post = raw_schedule["post"]
            account = raw_schedule["account"]
            schedules.append(apis.mastermemed.schedule.Schedule(
                time.strptime(raw_schedule["date"], ""),
                apis.mastermemed.account.Account(
                    account["username"], None,
                    account["startTime"],
                    account["endTime"],
                    id=account["id"],
                ),
                apis.mastermemed.post.Post(
                    post["platform"],
                    post["originalId"],
                    post["originalLink"],
                    post["contentUrl"],
                    post["thumbnail"],
                    id=post["id"],
                ),
            ))

        return schedules

    def addSchedule(self, account, post, date):
        data = {
            "account": account if isinstance(account, int) else account.id,
            "post": post if isinstance(post, int) else post.id,
            "date": date if isinstance(date, str) else date.strftime("%Y-%m-%d %H:%M:%S"),
        }
        response = self.__post("/schedule", json.dumps(data))
        return response.status == 201
