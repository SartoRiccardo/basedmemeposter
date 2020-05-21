
class Schedule:
    def __init__(self, date, account, post, id=None):
        if id:
            self.id = int(id)
        self.date = date
        self.account = account
        self.post = post

    def toJson(self):
        return vars(self)
