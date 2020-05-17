
class Post:
    def __init__(self, platform, original_id, original_link, content_url, thumbnail, **kwargs):
        if "id" in kwargs:
            self.id = kwargs["id"]
        self.platform = platform
        self.original_id = original_id
        self.original_link = original_link
        self.content_url = content_url
        self.thumbnail = thumbnail
        if "date_added" in kwargs:
            self.date_added = kwargs["date_added"]

    def toJson(self):
        return vars(self)
