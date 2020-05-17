from threading import Thread
import modules.threads
import time
import datetime
from random import random, randint
import os


class Account(Thread):
    IDLING = 30 * 60
    IDLING_NOISE = 0.3
    MISSING_POST_CHANCE = 1/15
    WAIT_FOR_SECONDS = 60

    def __init__(self, username, password, start_at, end_at, pool=None):
        super().__init__()

        self.username = username
        self.password = password
        self.start_at = time.strptime(start_at, "%H:%M:%S")
        self.end_at = time.strptime(end_at, "%H:%M:%S")
        self.pool = pool

        self.active = True
        self.post_path = None
        self.cooldown = 0

    def run(self):
        while self.active:
            if self.canPost():
                self.cooldown = randint(
                    Account.IDLING * (1-Account.MISSING_POST_CHANCE),
                    Account.IDLING * (1+Account.MISSING_POST_CHANCE),
                )
                if random() > Account.MISSING_POST_CHANCE:
                    self.post()

            modules.threads.waitfor(Account.WAIT_FOR_SECONDS)
            self.cooldown -= Account.WAIT_FOR_SECONDS

    def canPost(self):
        now = datetime.datetime.now()
        current_time = time.strptime(
            f"{now.hour:02d}:{now.minute:02d}:{now.second:02d}"
            "%H:%M:%S"
        )

        if self.start_at < self.end_at:
            in_time_range = self.start_at < current_time < self.end_at
        else:
            in_time_range = current_time > self.start_at or self.end_at > current_time

        return in_time_range and self.cooldown <= 0

    def post(self):
        link = "https://i.imgur.com/Cl96z64.mp4"
        random_file_name = self.retrieve(link)

    def retrieve(self, url):
        if self.pool is None:
            return

        chars = "asdfghjklqwertyuiopzxcvbnm"
        random_file_name = None
        do_while = True
        while do_while or os.path.exists(random_file_name):
            do_while = False
            random_file_name = "tmp/" + "".join(
                [chars[random.randint(0, len(chars)-1)] for _ in range(10)]
            ) + url[-4:]

        stdout = open(random_file_name, "wb")
        response = self.pool.request("GET", url, preload_content=False)
        for chunk in response.stream(1024):
            stdout.write(chunk)
        response.release_conn()

        return random_file_name

    def stopPosting(self):
        self.active = False
