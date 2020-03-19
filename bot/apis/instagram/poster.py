from apis.instagram import scraper


class Poster:
    def __init__(self, user, pswd, lang="eng"):
        self.lang = lang
        self.user = user
        self.pswd = pswd

    def post(self, image, caption):
        s = scraper.Scraper(self.user, self.pswd, image, caption, self.lang)
        s.start()

    def __str__(self):
        return f"<apis.instagram.Poster logged in as {self.user}"
