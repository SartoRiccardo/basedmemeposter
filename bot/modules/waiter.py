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
