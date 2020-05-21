from threading import Thread
import traceback
import modules.threads
import apis.instagram
from datetime import datetime, timezone
from random import randint
import os


class Account(Thread):
    CAPTION_END = "\n~\n~\n~\n"
    HASHTAGS = ['#bestmemes', '#instamemes', '#funny', '#funnymemes', '#offensivememes', '#edgymemes', '#spicymemes', '#nichememes', '#memepage', '#funniestmemes', '#dank', '#memesdaily', '#jokes', '#memesrlife', '#memestar', '#memesquad', '#humor', '#lmao', '#igmemes', '#lol', '#memeaccount', '#memer', '#relatablememes', '#funnyposts', '#sillymemes', '#nichememe', '#memetime', '#memeimages', '#newestmemes', '#todaymemes', '#recentmemes', '#decentmemes', '#memearmy', '#memedose', '#memehumor', '#questionablememes', '#sickmeme', '#oldmeme', '#unusualmeme', '#memeculture', '#memehour', '#bizarrememe', '#scarymeme', '#sarcasm', '#goofymemes', '#entertaining', '#ironic', '#stupidmemes', '#crazymemes', '#lightmeme', '#annoyingthings', '#memehearted', '#wtfmeme', '#dogmemes', '#catmeme', '#fortnitememes', '#clevermemes', '#oddlymemes', '#dumbmemes', '#interestingmemes', '#likablememes', '#beameme', '#fulltimememer', '#cornymeme', '#surrealmeme', '#wowmemes', '#originalmemes', '#creepymemes', '#memefarm', '#mememaker', '#memebased', '#meming', '#memelord', '#latinmemes', '#schoolmemes', '#relevantmeme', '#bestjokes', '#memeboss', '#dadjokes', '#famousmemes', '#memeintelligence', '#memeuniversity', '#gamingmemes', '#rapmemes', '#coldmemes', '#memeit', '#prettyfunny', '#memevibes', '#boringmemes', '#geniusmemes', '#funnyvideos', '#bestmemevideos', '#funnythings', '#funnystories', '#memestory', '#memesgraciosos', '#laughs', '#cleverjokes', '#memeworld', '#memezar', '#amazingmemes', '#funnymemesdaily', '#memespam', '#moodmemes', '#dankspam', '#awfulmeme', '#quitefunny', '#trumpmemes', '#obamamemes', '#nbamemes', '#memestuff', '#unbelievable', '#savagememes', '#meaningful', '#comedy', '#dailycomedy', '#hahaha', '#deliciously', '#funnier', '#lovememes', '#snickermemes', '#awful', '#animalmemes', '#funnyquotes', '#funnyposts', '#mockery', '#delightfulmeme', '#enjoyable', '#topmeme', '#americanmemes', '#ukmemes', '#usamemes', '#russianmemes', '#memethings', '#memeparody', '#friendmemes', '#dadmemes', '#familymemes', '#schoolmemes', '#terribly', '#notfunny', '#parody', '#funnypets', '#housememes', '#youtubememe', '#redditmemes', '#pewdsmemes', '#spongebobmemes', '#moviememes', '#cruelmemes', '#honestmemes', '#workmemes', '#nonsense', '#animememes', '#baseballmemes', '#soccermemes', '#footballmemes', '#basketballmemes', '#joking', '#memorable', '#awkward', '#memeguy', '#funnystuff', '#darkmemes', '#onememe', '#memesounds', '#straightforward', '#wow', '#memetalk', '#mememoments', '#mock', '#memelanguage', '#memenation', '#coping', '#memep', '#memescreator', '#memereviewer', '#funniestvideos', '#joker', '#memesupreme', '#memefame', '#highschoolmemes', '#emotionmeme', '#ubermemes', '#laugher', '#bestpuns', '#funnypuns', '#memelab', '#memeschool', '#memeplayers', '#memeroom', '#laughsome', '#promemer', '#fulltimememer', '#rofl', '#comedian', '#memetrends', '#sarcasticmemes', '#wethememe', '#exmeme', '#memed', '#relationshipmemes', '#drivingmemes', '#workoutmemes', '#laughworthy', '#memecreativity', '#outlaugh', '#memeaddicts', '#drunkpeoplememes', '#partymemes', '#favoritememes', '#girlmemes', '#boymemes', '#artistmeme', '#youtubememes', '#memerevolution', '#memewar', '#lastmeme', '#mememedication', '#prememe', '#memescholar', '#morale', '#justmemes', '#skatememes', '#kanyewestmemes', '#mostrecentmemes', '#spanishmemes', '#memefollow', '#bememe', '#gomeme', '#memedinner', '#memechef', '#policememes', '#rapmemes', '#hiphopmemes', '#computermemes', '#memespecialist', '#rotflmao', '#clownmemes', '#memevideos', '#managermemes', '#imeme', '#memeanalyst', '#memegraduate', '#lulz', '#tomandjerry', '#roflmfao', '#sociology', '#chickenmemes', '#horselaugh', '#laughingwithmemes', '#germanymeme', '#mememedia', '#stolenmemes', '#memegroup', '#wellbeing', '#secretlymeming', '#actormemes', '#singermemes', '#guitaristmemes', '#memelecutre', '#funtimes', '#socratesmemes', '#merrymemes', '#stylememes', '#teachermemes', '#relate']
    HASHTAG_AMOUNT = 21

    def __init__(self, id, username, password, schedule, pool=None, getCaptionCallback=None):
        super().__init__()

        self.id = id
        self.username = username
        self.password = password
        self.schedule = schedule
        self.pool = pool
        self.getCaptionCallback = getCaptionCallback
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
            modules.threads.waitfor(randint(60, 120))

    def checkForPosts(self):
        now = datetime.now(tz=timezone.utc)
        to_post = []
        for schedule in self.schedule:
            date = schedule.date
            if now > date:
                to_post.append(schedule.post)

        ids_to_post = [post.id for post in to_post]
        for post in to_post:
            hashtags = []
            while len(hashtags) < Account.HASHTAG_AMOUNT:
                i = randint(0, len(Account.HASHTAGS)-1)
                if i not in hashtags:
                    hashtags.append(i)
            hashtags = [Account.HASHTAGS[i] for i in hashtags] + ["#meme", "#memes", "#dankmeme", "#dankmemes"]
            caption = self.getCaptionCallback() if self.getCaptionCallback else ""
            caption = caption + Account.CAPTION_END + " ".join(hashtags)

            self.schedule = [
                s for s in self.schedule
                if s.post.id not in ids_to_post
            ]

            self.post(post.content_url, caption)

    def post(self, url, caption):
        post_file = self.retrieve(url)
        if not post_file:
            self.logger.error(f"Image could not be found ({url})")
            return

        scraper = apis.instagram.Scraper(
            self.username, self.password, post_file, caption
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
