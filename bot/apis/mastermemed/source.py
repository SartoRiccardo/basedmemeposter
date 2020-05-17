
class Source:
    def __init__(self, name, platform, id=None):
        if id:
            self.id = id
        self.name = name
        self.platform = platform

    def toJson(self):
        return vars(self)
