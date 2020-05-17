from threading import Thread
import modules.threads
import apis.instagram
import time
import datetime
from random import random, randint
import os


class Account(Thread):
    IDLING = 30 * 60
    IDLING_NOISE = 0.3
    MISSING_POST_CHANCE = 1/15
    WAIT_FOR_SECONDS = 60

    CAPTION_END = "~\n~\n~\n"
    HASHTAGS = ['#meme', '#memes', '#bestmemes', '#instamemes', '#funny', '#funnymemes', '#dankmemes', '#offensivememes', '#edgymemes', '#spicymemes', '#nichememes', '#memepage', '#funniestmemes', '#dank', '#memesdaily', '#jokes', '#memesrlife', '#memestar', '#memesquad', '#humor', '#lmao', '#igmemes', '#lol', '#memeaccount', '#memer', '#relatablememes', '#funnyposts', '#sillymemes', '#nichememe', '#memetime', '#memeimages', '#newestmemes', '#todaymemes', '#recentmemes', '#decentmemes', '#memearmy', '#memedose', '#memehumor', '#questionablememes', '#sickmeme', '#oldmeme', '#unusualmeme', '#memeculture', '#memehour', '#bizarrememe', '#scarymeme', '#sarcasm', '#goofymemes', '#entertaining', '#ironic', '#stupidmemes', '#crazymemes', '#lightmeme', '#annoyingthings', '#memehearted', '#wtfmeme', '#dogmemes', '#catmeme', '#fortnitememes', '#clevermemes', '#oddlymemes', '#dumbmemes', '#interestingmemes', '#likablememes', '#beameme', '#fulltimememer', '#cornymeme', '#surrealmeme', '#wowmemes', '#originalmemes', '#creepymemes', '#memefarm', '#mememaker', '#memebased', '#meming', '#memelord', '#latinmemes', '#schoolmemes', '#relevantmeme', '#bestjokes', '#memeboss', '#dadjokes', '#famousmemes', '#memeintelligence', '#memeuniversity', '#gamingmemes', '#rapmemes', '#coldmemes', '#memeit', '#prettyfunny', '#memevibes', '#boringmemes', '#geniusmemes', '#funnyvideos', '#bestmemevideos', '#funnythings', '#funnystories', '#memestory', '#memesgraciosos', '#laughs', '#cleverjokes', '#memeworld', '#memezar', '#amazingmemes', '#funnymemesdaily', '#memespam', '#moodmemes', '#dankspam', '#awfulmeme', '#quitefunny', '#trumpmemes', '#obamamemes', '#nbamemes', '#memestuff', '#unbelievable', '#savagememes', '#meaningful', '#comedy', '#dailycomedy', '#hahaha', '#deliciously', '#funnier', '#lovememes', '#snickermemes', '#awful', '#animalmemes', '#funnyquotes', '#funnyposts', '#mockery', '#delightfulmeme', '#enjoyable', '#topmeme', '#americanmemes', '#ukmemes', '#usamemes', '#russianmemes', '#memethings', '#memeparody', '#friendmemes', '#dadmemes', '#familymemes', '#schoolmemes', '#terribly', '#notfunny', '#parody', '#funnypets', '#housememes', '#youtubememe', '#redditmemes', '#pewdsmemes', '#spongebobmemes', '#moviememes', '#cruelmemes', '#honestmemes', '#workmemes', '#nonsense', '#animememes', '#baseballmemes', '#soccermemes', '#footballmemes', '#basketballmemes', '#joking', '#memorable', '#awkward', '#memeguy', '#funnystuff', '#darkmemes', '#onememe', '#memesounds', '#straightforward', '#wow', '#memetalk', '#mememoments', '#mock', '#memelanguage', '#memenation', '#coping', '#memep', '#memescreator', '#memereviewer', '#funniestvideos', '#joker', '#memesupreme', '#memefame', '#highschoolmemes', '#emotionmeme', '#ubermemes', '#laugher', '#bestpuns', '#funnypuns', '#memelab', '#memeschool', '#memeplayers', '#memeroom', '#laughsome', '#promemer', '#fulltimememer', '#rofl', '#comedian', '#memetrends', '#sarcasticmemes', '#wethememe', '#exmeme', '#memed', '#relationshipmemes', '#drivingmemes', '#workoutmemes', '#laughworthy', '#memecreativity', '#outlaugh', '#memeaddicts', '#drunkpeoplememes', '#partymemes', '#favoritememes', '#girlmemes', '#boymemes', '#artistmeme', '#youtubememes', '#memerevolution', '#memewar', '#lastmeme', '#mememedication', '#prememe', '#memescholar', '#morale', '#justmemes', '#skatememes', '#kanyewestmemes', '#mostrecentmemes', '#spanishmemes', '#memefollow', '#bememe', '#gomeme', '#memedinner', '#memechef', '#policememes', '#rapmemes', '#hiphopmemes', '#computermemes', '#memespecialist', '#rotflmao', '#clownmemes', '#memevideos', '#managermemes', '#imeme', '#memeanalyst', '#memegraduate', '#lulz', '#tomandjerry', '#roflmfao', '#sociology', '#chickenmemes', '#horselaugh', '#laughingwithmemes', '#germanymeme', '#mememedia', '#stolenmemes', '#memegroup', '#wellbeing', '#secretlymeming', '#actormemes', '#singermemes', '#guitaristmemes', '#memelecutre', '#funtimes', '#socratesmemes', '#merrymemes', '#stylememes', '#teachermemes', '#relate']
    HASHTAG_AMOUNT = 25

    def __init__(self, username, password, start_at, end_at, pool=None, getCaptionCallback=None):
        super().__init__()

        self.username = username
        self.password = password
        self.start_at = time.strptime(start_at, "%H:%M:%S")
        self.end_at = time.strptime(end_at, "%H:%M:%S")
        self.pool = pool
        self.getCaptionCallback = getCaptionCallback

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
        post_file = self.retrieve(link)

        hashtags = []
        while len(hashtags) < Account.HASHTAG_AMOUNT:
            i = randint(0, len(hashtags)-1)
            if i not in hashtags:
                hashtags.append(i)
        hashtags = [Account.HASHTAGS[i] for i in hashtags]
        caption = self.getCaptionCallback() if self.getCaptionCallback else ""
        caption = caption + Account.CAPTION_END + " ".join(hashtags)

        scraper = apis.instagram.Scraper(
            self.username, self.password, post_file, caption, "EN"
        )
        scraper.start()
        scraper.join()

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
