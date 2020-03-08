from apis.config import CLIENT_ID
import urllib3
import json


class ImgurClient:
    def __init__(self, client_id):
        self.client_id = client_id
        self.http = urllib3.PoolManager()

    def get(self, endpoint):
        url = f"https://api.imgur.com/3{endpoint}"
        r = self.http.request(
            "GET",
            url,
            headers={
                "Authorization": f"Client-ID {self.client_id}"
            }
        )
        return r


class Image:
    def __init__(self, data):
        self.id = data["id"]
        self.type = data["type"]
        self.animated = data["animated"]
        self.width = data["width"]
        self.height = data["height"]
        self.size = data["size"]
        self.nsfw = data["nsfw"]
        self.has_sound = data["has_sound"]
        self.link = data["link"]

    def __dict__(self):
        return {
            "id": self.id,
            "type": self.type,
            "animated": self.animated,
            "width": self.width,
            "height": self.height,
            "size": self.size,
            "nsfw": self.nsfw,
            "has_sound": self.has_sound,
            "link": self.link,
        }

    def __str__(self):
        return json.dumps(self.__dict__())

    def toJson(self):
        return str(self)


class Gallery:
    def __init__(self, data):
        self.id = data["id"]
        self.title = data["title"]
        self.description = data["description"]
        self.account_url = data["account_url"]
        self.link = data["link"]
        self.nsfw = data["nsfw"]
        self.is_album = data["is_album"]

        if self.is_album:
            self.images_count = data["images_count"]
            self.images = [Image(i) for i in data["images"]]
            self.__images_iter = 0
        else:
            self.type = data["type"]
            self.width = data["width"]
            self.height = data["height"]

    def __dict__(self):
        ret = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "account_url": self.account_url,
            "link": self.link,
            "nsfw": self.nsfw,
            "is_album": self.is_album,
        }

        if self.is_album:
            ret = {
                **ret,
                "images_count": self.images_count,
                "images": [i.__dict__() for i in self.images],
            }
        else:
            ret = {
                **ret,
                "type": self.type,
                "width": self.width,
                "height": self.height,
            }

        return ret

    def __str__(self):
        return json.dumps(self.__dict__())

    def toJson(self):
        return str(self)

    def __iter__(self):
        self.__images_iter = 0
        return self

    def __next__(self):
        if not self.is_album or self.__images_iter not in range(0, len(self.images)):
            raise StopIteration

        ret = self.images[self.__images_iter]
        self.__images_iter = self.__images_iter + 1
        return ret


client = ImgurClient(CLIENT_ID)


def topGalleries():
    response = client.get("/gallery/top")
    galleries = json.loads(response.data)["data"]

    ret = [Gallery(g) for g in galleries]
    return ret


def getGallery(gallery_hash):
    response = client.get(f"/gallery/{gallery_hash}")
    gallery = json.loads(response.data)["data"]
    ret = Gallery(gallery)
    return ret
