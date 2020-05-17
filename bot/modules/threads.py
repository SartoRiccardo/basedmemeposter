import datetime
import time
from threading import Thread


class Waiter(Thread):
    def __init__(self, until):
        super().__init__()
        self.until = until

    def run(self):
        while self.until > datetime.datetime.now():
            time.sleep(10)


class PostUploader(Thread):
    def __init__(self, mastermemed_client):
        super().__init__()
        self.posts = []
        self.mastermemed_client = mastermemed_client

    def addPost(self, post):
        self.posts.append(post)

    def run(self):
        for p in self.posts:
            print(f"[{self.name}] Uploading a post")
            self.mastermemed_client.addPost(p)


def waitfor(seconds):
    thread = Waiter(datetime.datetime.now() + datetime.timedelta(seconds=seconds))
    thread.start()
    thread.join()
