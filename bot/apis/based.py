from config import config

import urllib3
import datetime
import json


class BasedClient:
    BASED_URL = config("based", "url")

    def __init__(self, client_id):
        """
        A class to make request to the Based API.
        :param client_id: str: The Based access token
        """
        self.client_id = client_id
        self.http = urllib3.PoolManager()

    def __get(self, endpoint, params):
        url = f"{BasedClient.BASED_URL}{endpoint}"
        return self.http.request(
            "GET", url,
            fields=params,
            headers={
                "Authorization": f"Bearer {self.client_id}"
            }
        )

    def __post(self, endpoint, data):
        return self.http.request(
            "POST", f"{BasedClient.BASED_URL}{endpoint}",
            body=data,
            headers={
                "Authorization": f"Bearer {self.client_id}",
                "Content-Type": "application/json",
            },
        )

    def insertPost(self, post):
        """
        Inserts a post.
        :param post: BasedPost: The post to insert
        """
        response = self.__post("/posts", post.toJson())
        if response.status == 201:
            return response.getheader("Location")

    def log(self, level, message, **kwargs):
        """
        Logs an action.
        :param level: the log level. Can be DEBUG, INFO, WARNING, ERROR or CRITICAL.
        :param message: The log message.
        :return:
        """
        body = {
            "level": level,
            "message": message,
            "time": datetime.datetime.now(),
        }
        additional_keys = ["user", "trace"]
        for key in additional_keys:
            if key in kwargs:
                body[key] = kwargs[key]
        response = self.__post("/logs", body)
        if response.status == 201:
            return response.getheader("Location")

    def posts(self, **kwargs):
        """
        Gets some posts.
        :return: BasedPost[]: The posts.
        """
        response = self.__get("/posts", kwargs)
        if response.status == 200:
            response = json.loads(response.data.decode())
            return [BasedPost(
                post["platform"], post["original_id"], post["original_link"],
                post["image_url"], id=post["id"], date_added=post["date_added"]
            ) for post in response["data"]["posts"]]

    def schedulePost(self, post, account, date):
        """
        Schedules a post
        :param post: str/BasedPost: the post to schedule
        :param account: int: The ID of the account that will post the post
        :param date: datetime: The date to publish the post at
        :return: str: The location of the schedule
        """
        if isinstance(post, BasedPost):
            post = post.id if hasattr(post, "id") else None

        if post is None:
            raise Exception("some exception i'll come back to later")

        self.__post("/schedules", {
            "post": post, "account": account, "date": date
        })

    def scheduleFor(self, account, already_posted=False):
        data = {
            "account": account
        }
        if already_posted:
            data["already_posted"] = True
        response = self.__get("/schedules", data)
        if response.status == 200:
            return response.data


class BasedPost:
    def __init__(self, platform, original_id, original_link, image_url, **kwargs):
        self.platform = platform
        self.original_id = original_id
        self.original_link = original_link
        self.image_url = image_url
        if "id" in kwargs:
            self.id = kwargs["id"]
        if "date_added" in kwargs:
            self.date_added = kwargs["date_added"]

    def toJson(self):
        return vars(self)
