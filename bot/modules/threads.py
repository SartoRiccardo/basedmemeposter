from datetime import datetime, timezone, timedelta
import time
from threading import Thread


class Waiter(Thread):
    def __init__(self, until):
        super().__init__()
        self.until = until

    def run(self):
        while self.until > datetime.now(timezone.utc):
            time.sleep(10)


class PostUploader(Thread):
    def __init__(self, mastermemed_client, success_counter):
        super().__init__()
        self.posts = []
        self.mastermemed_client = mastermemed_client
        self.success_counter = success_counter

    def addPost(self, post):
        self.posts.append(post)

    def run(self):
        for p in self.posts:
            if self.mastermemed_client.addPost(p):
                self.success_counter.increment()


def waitfor(seconds):
    thread = Waiter(datetime.now(timezone.utc) + timedelta(seconds=seconds))
    thread.start()
    thread.join()


def waituntil(condition, check_every):
    while not condition():
        thread = Waiter(datetime.now(timezone.utc) + timedelta(seconds=check_every))
        thread.start()
        thread.join()
