import urllib3
import json


def get_posts_from_user(user):
    url = f"https://www.instagram.com/{user}/?__a=1"

    pool = urllib3.PoolManager()
    response = pool.request("GET", url)
    response = json.loads(response.data.decode())
    user_data = response["graphql"]["user"]

    if user_data["is_private"]:
        return
    posts = [data["node"] for data in user_data["edge_owner_to_timeline_media"]["edges"]]

    ret = []
    for p in posts:
        if p["__typename"] == "GraphImage":
            ret.append(p)

    return ret