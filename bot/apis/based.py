from apis.config import BASED_ID
from urllib.parse import urlencode
import urllib3
import json


class BasedClient:
    BASE_URL = "http://localhost/basedmemeposter/server"

    def __init__(self, client_id):
        """
        A class to make request to the Based API.
        :param client_id: str: The Based access token
        """
        self.client_id = client_id
        self.http = urllib3.PoolManager()

    def get(self, endpoint):
        url = f"{BasedClient.BASE_URL}{endpoint}"
        r = self.http.request(
            "GET",
            url,
            headers={
                "Authorization": f"{self.client_id}"
            }
        )
        return r

    def post(self, endpoint, params):
        url = f"{BasedClient.BASE_URL}{endpoint}?{urlencode(params)}"
        r = self.http.request(
            "POST",
            url,
            headers={
                "Authorization": f"{self.client_id}"
            }
        )

        res = json.loads(r.data.decode("utf-8"))
        if res["error"] is not None:
            raise Exception(res["error"])
        return res["data"]


client = BasedClient(BASED_ID)


def insertPost(id, platform):
    """
    Inserts a post.
    :param id: str: The post's ID on its platform.
    :param platform: str: The post's platform.
    :return: int: The ID of the newly inserted post.
    """
    response = client.post("/post", {
        "platform_id": id,
        "platform": platform,
    })

    return response["post_id"]
