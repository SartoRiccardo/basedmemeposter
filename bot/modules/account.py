from threading import Thread
import traceback
import modules.threads
import apis.instagram
from datetime import datetime, timezone
from random import randint, random
import os
import math


class Account(Thread):
    CAPTION_END = "\n~\n~\n~\n#meme #memes #funny #dankmemes #memesdaily #funnymemes #lol #dank #follow #humor #like #dankmeme #love #lmao #ol #comedy #instagram #tiktok #dailymemes #anime #edgymemes #fun #offensivememes #memepage #funnymeme #memestagram #memer #fortnite #haha #bhfyp"

    def __init__(self, id, mastermemed_client, pool=None):
        super().__init__()

        self.id = id
        self.mastermemed_client = mastermemed_client
        self.pool = pool
        self.schedule = []
        self.logger = None

        self.active = True

    def run(self):
        while self.active:
            try:
                self.checkForPosts()
            except Exception as exc:
                error = traceback.format_exc()
                if self.logger:
                    self.logger.critical(error)
                return
            modules.threads.waitfor(randint(2*60, 5*60))

    def checkForPosts(self):
        now = datetime.now(tz=timezone.utc)

        to_post = []
        for s in self.schedule:
            date = s.date
            if now > date:
                to_post.append(s.post)

        for post in to_post:
            caption = self.randomCaption() if random() <= 0.6 else ""
            caption += Account.CAPTION_END
            self.post(post.content_url, caption)

        ids_to_post = [post.id for post in to_post]

        updated_schedule = self.mastermemed_client.schedules(account=self.id, only_scheduled=True)
        updated_schedule_ids = [s.id for s in updated_schedule]

        self.schedule = [
            s for s in self.schedule
            if s.post.id not in ids_to_post and s.id in updated_schedule_ids
        ]

        session_schedule_ids = [s.id for s in self.schedule]
        self.schedule += [
            s for s in updated_schedule
            if s.id not in session_schedule_ids
        ]

    def post(self, url, caption):
        post_file = self.retrieve(url)
        if not post_file:
            self.logger.error(f"Image could not be found ({url})")
            return

        account = self.mastermemed_client.account(self.id)
        scraper = apis.instagram.Scraper(
            account.username, account.password, post_file, caption,
            account_id=self.id
        )
        if self.logger:
            scraper.setLogger(self.logger)
        scraper.start()
        scraper.join()

        if os.path.exists(post_file):
            os.remove(post_file)

    def retrieve(self, url):
        if self.pool is None:
            return None

        chars = "asdfghjklqwertyuiopzxcvbnm"
        random_file_name = None
        do_while = True
        while do_while or os.path.exists(random_file_name):
            do_while = False
            random_file_name = "tmp/" + "".join(
                [chars[randint(0, len(chars)-1)] for _ in range(10)]
            ) + url[-4:]

        if not os.path.exists("tmp"):
            os.mkdir("tmp")

        stdout = open(random_file_name, "wb")
        response = self.pool.request("GET", url, preload_content=False)
        for chunk in response.stream(1024):
            stdout.write(chunk)
        response.release_conn()

        if response.status == 404:
            os.remove(random_file_name)
            return None

        return os.path.abspath(random_file_name)

    def stopPosting(self):
        self.active = False

    def setLogger(self, logger):
        self.logger = AccountLogger(self.id, logger)

    def randomCaption(self):
        try:
            data = self.mastermemed_client.captionData()
            caption_count, captions_per_page = data["total"], data["per_page"]
            caption_i = randint(0, caption_count-1)
            caption_page = math.floor(caption_i/captions_per_page)
            caption_i -= caption_page*captions_per_page

            return self.mastermemed_client.captions(page=caption_page)[caption_i].text
        except Exception as exc:
            return ""


class AccountLogger:
    def __init__(self, account_id, mastermemed_client):
        self.account_id = account_id
        self.mastermemed_client = mastermemed_client

    def debug(self, message):
        self.mastermemed_client.debug(message, int(self.account_id))

    def info(self, message):
        self.mastermemed_client.info(message, int(self.account_id))

    def warning(self, message):
        self.mastermemed_client.warning(message, int(self.account_id))

    def error(self, message):
        self.mastermemed_client.error(message, int(self.account_id))

    def critical(self, message):
        self.mastermemed_client.critical(message, int(self.account_id))
