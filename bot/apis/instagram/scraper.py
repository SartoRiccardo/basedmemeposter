from apis.instagram import scheduler
import platform
import threading
import os
import time
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


def checkActive(action):
    def ret(self):
        if self.abort:
            return
        action(self)

    return ret


def beforePosting(action):
    def ret(self):
        if self.skip_to_posting:
            return
        action(self)

    return ret


class Scraper(threading.Thread):
    BUTTON_TEXT = {
        "not_now": {
            "it": "Non ora",
            "eng": "Not Now",
        },
        "save_access": {
            "it": "Salva le informazioni",
            "eng": "Save Info",
        },
        "login": {
            "it": "Accedi",
            "eng": "Log In",
        },
        "cancel": {
            "it": "Annulla",
            "eng": "Cancel",
        },
        "next": {
            "it": "Avanti",
            "eng": "Next",
        },
        "expand": {
            "it": "Espandi",
            "eng": "Expand",
        },
        "caption_aria": {
            "it": "Scrivi una didascalia…",
            "eng": "Write a caption…",
        },
        "share": {
            "it": "Condividi",
            "eng": "Share",
        },
    }

    def __init__(self, user, pswd, image, caption, lang="eng", account_id=None):
        super().__init__()

        self.lang = lang
        self.user = user
        self.pswd = pswd
        self.image = image
        self.caption = caption

        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_experimental_option("mobileEmulation", {"deviceName": "Pixel 2"})
        print(f"ACCOUNT: {account_id}")
        if account_id:
            if not os.path.exists("account-data"):
                os.mkdir("account-data")
            if not os.path.exists(f"account-data/account_{account_id}"):
                os.mkdir(f"account-data/account_{account_id}")
            user_dir = os.path.abspath(f"account-data/account_{account_id}")
            options.add_argument(f"user-data-dir={user_dir}")

        chromedriver = f"./webdrivers/{platform.system()}"
        self.driver = webdriver.Chrome(
            executable_path=chromedriver,
            options=options
        )

        self.logger = None
        self.abort = False
        self.skip_to_posting = False

    def setLogger(self, logger):
        self.logger = logger

    def run(self):
        self.abort = False
        actions = [
            {"action": self.search_instagram,   "wait": 3},
            {"action": self.click_login,        "wait": 5},
            {"action": self.login,              "wait": 10},
            {"action": self.save_access_info,   "wait": 10},
            {"action": self.close_notification, "wait": 10},
            {"action": self.close_add_to_home,  "wait": 10},
            {"action": self.open_file_menu,     "wait": 5},
            {"action": self.send_file,          "wait": 7},
            {"action": self.expand_image,       "wait": 10},
            {"action": self.next_step,          "wait": 7},
            {"action": self.write_caption,      "wait": 10},
            {"action": self.share,              "wait": 20},
            {"action": self.like_some_posts,    "wait": 5},
            {"action": self.close,              "wait": 2},
        ]
        schedule = scheduler.Scheduler(actions)
        schedule.start()  # Not actually a thread

    @checkActive
    def search_instagram(self):
        self.driver.get("https://www.instagram.com")

    @checkActive
    def click_login(self):
        try:
            text = Scraper.BUTTON_TEXT["login"][self.lang]
            login_button = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            login_button.click()
        except NoSuchElementException:
            self.skip_to_posting = True
            if self.logger:
                self.logger.info("Assuming already logged in")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While clicking Login: {exc}")

    @beforePosting
    @checkActive
    def login(self):
        try:
            self.driver.find_element_by_xpath("//input[@name='username']").send_keys(self.user)
            password_input = self.driver.find_element_by_xpath("//input[@name='password']")
            password_input.send_keys(self.pswd)
            password_input.submit()
            if self.logger:
                self.logger.debug("Logged in")
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.error("Could not insert credentials")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While logging in: {exc}")

    @beforePosting
    @checkActive
    def save_access_info(self):
        try:
            text = Scraper.BUTTON_TEXT["save_access"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            not_now_btn.click()
            if self.logger:
                self.logger.debug("Saved access info")
        except NoSuchElementException:
            if self.logger:
                self.logger.debug("Was not asked to save access info")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While saving access info: {exc}")

    @checkActive
    def close_notification(self):
        try:
            text = Scraper.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            not_now_btn.click()
            if self.logger:
                self.logger.debug("Closed Allow Notifications popup")
        except NoSuchElementException:
            if self.logger:
                self.logger.debug("Did not cancel Allow Notifications popup")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While closing Allow Notifications: {exc}")

    @checkActive
    def close_add_to_home(self):
        try:
            text = Scraper.BUTTON_TEXT["cancel"][self.lang]
            cancel_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            cancel_btn.click()
            if self.logger:
                self.logger.debug("Closed Add to Home popup")
        except NoSuchElementException:
            if self.logger:
                self.logger.debug("Did not cancel Add to Home popup")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While closing Add to Home: {exc}")

    @checkActive
    def open_file_menu(self):
        try:
            self.driver.find_element_by_xpath("//div[@role='menuitem']").click()
            if self.logger:
                self.logger.debug("Opened the file menu")
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.error("Could not open the file menu")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While opening the file menu: {exc}")

    @checkActive
    def send_file(self):
        try:
            input_field = self.driver.find_element_by_xpath(f"//input[@type=\"file\"]")
            input_field.send_keys(self.image)
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.error("Could not find file input")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While sending the file: {exc}")

    @checkActive
    def next_step(self):
        try:
            text = Scraper.BUTTON_TEXT["next"][self.lang]
            next_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            next_btn.click()
            if self.logger:
                self.logger.debug("Submitted image")
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.error("Could not submit image")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While submitting the image: {exc}")

    @checkActive
    def write_caption(self):
        try:
            text = Scraper.BUTTON_TEXT["caption_aria"][self.lang]
            caption_field = self.driver.find_element_by_xpath(f"//textarea[@aria-label='{text}']")
            caption_field.send_keys(self.caption)
            if self.logger:
                self.logger.debug("Wrote caption")
        except NoSuchElementException:
            if self.logger:
                self.logger.warning("Could not write a caption")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While writing the caption: {exc}")

    @checkActive
    def share(self):
        try:
            text = Scraper.BUTTON_TEXT["share"][self.lang]
            share_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            share_btn.click()
            if self.logger:
                self.logger.info("Shared image")
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.error("Could not share image")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While sharing: {exc}")

    @checkActive
    def expand_image(self):
        try:
            text = Scraper.BUTTON_TEXT["expand"][self.lang]
            expand_btn = self.driver.find_element_by_xpath(f"//span[contains(text(),'{text}')]")
            expand_btn.click()
            if self.logger:
                self.logger.debug("Image resized")
        except NoSuchElementException:
            self.abort = True
            if self.logger:
                self.logger.warning("Image could not be resized")
        except Exception as exc:
            self.abort = True
            if self.logger:
                self.logger.error(f"While expanding the image: {exc}")

    @checkActive
    def like_some_posts(self):
        try:
            posts = self.driver.find_elements_by_xpath("//article")
            mine = True
            for p in posts:
                if mine:
                    mine = False
                    continue
                p.click()
                time.sleep(0.1)
                p.click()
                time.sleep(3)
        except Exception as exc:
            if self.logger:
                self.logger.error(f"Something happened while liking posts")

    @checkActive
    def watch_some_stories(self):
        try:
            stories = self.driver.find_elements_by_xpath("//button[@role='menuitem']")
            if len(stories) <= 1:
                return
            stories[1].click()
            time.sleep(30)
        except Exception as exc:
            if self.logger:
                self.logger.error(f"Something happened while watching stories")

    def close(self):
        self.driver.quit()

