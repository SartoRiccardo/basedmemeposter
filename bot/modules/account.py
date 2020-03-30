from threading import Thread
import random
import os


class Account(Thread):
    def __init__(self, username, password, pool=None):
        super().__init__()

        self.username = username
        self.password = password
        self.pool = pool

        self.post_path = None

    def run(self):
        link = "https://i.imgur.com/Cl96z64.mp4"
        self.retrieve(link)

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
