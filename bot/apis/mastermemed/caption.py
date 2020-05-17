
class Caption:
    def __init__(self, text, **kwargs):
        if "id" in kwargs:
            self.id = kwargs["id"]
        self.text = text

    def toJson(self):
        return vars(self)
