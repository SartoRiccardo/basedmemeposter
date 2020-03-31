from urllib.parse import urlencode
import urllib3
import json


class BasedClient:
    def __init__(self, client_id):
        """
        A class to make request to the Based API.
        :param client_id: str: The Based access token
        """
        self.client_id = client_id
        self.http = urllib3.PoolManager()

    def get(self, endpoint):
        url = f"{1}{endpoint}"
        r = self.http.request(
            "GET",
            url,
            headers={
                "Authorization": f"Bearer {self.client_id}"
            }
        )
        return r

    def post(self, endpoint, params):
        url = f"{1}{endpoint}?{urlencode(params)}"
        r = self.http.request(
            "POST",
            url,
            headers={
                "Authorization": f"Bearer {self.client_id}"
            }
        )

        res = json.loads(r.data.decode("utf-8"))
        if res["error"] is not None:
            raise Exception(res["error"])
        return res["data"]


class BasedPost:
    def __init__(self, platform, original_id, original_link, image_url):
        self.platform = platform
        self.original_id = original_id
        self.original_link = original_link
        self.image_url = image_url

    def toJson(self):
        return vars(self)


def insertPost(based_post):
    """
    Inserts a post.
    :param based_post: BasedPost: The post to insert.
    :return: int: The ID of the newly inserted post.
    """
    pass
