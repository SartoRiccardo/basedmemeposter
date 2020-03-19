from apis.instagram import scheduler
import logging
import platform
import threading
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


logger = logging.Logger(__name__)

file_handler = logging.FileHandler("./logs/instagram.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(
    logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s")
)
logger.addHandler(file_handler)


class Scraper(threading.Thread):
    BUTTON_TEXT = {
        "not_now": {
            "it": "Non ora",
            "eng": "Not Now",
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
        "caption_aria": {
            "it": "Scrivi una didascalia…",
            "eng": "Write a caption…",
        },
        "share": {
            "it": "Condividi",
            "eng": "Share",
        },
    }

    def __init__(self, user, pswd, image, caption, lang):
        super().__init__()

        self.lang = lang
        self.user = user
        self.pswd = pswd
        self.image = image
        self.caption = caption

        mobile = webdriver.ChromeOptions()
        mobile.add_argument("--headless")
        mobile.add_experimental_option("mobileEmulation", {"deviceName": "Pixel 2"})

        chromedriver = f"./webdrivers/{platform.system()}"
        self.driver = webdriver.Chrome(
            executable_path=chromedriver,
            options=mobile
        )

    def run(self):
        actions = [
            {"action": self.search_instagram, "wait": 3},
            {"action": self.click_login, "wait": 5},
            {"action": self.login, "wait": 10},
            {"action": self.close_reactivated, "wait": 10},
            {"action": self.close_notification, "wait": 10},
            {"action": self.close_add_to_home, "wait": 10},
            {"action": self.open_file_menu, "wait": 5},
            {"action": self.send_file, "wait": 10},
            {"action": self.next_step, "wait": 7},
            {"action": self.write_caption, "wait": 10},
            {"action": self.share, "wait": 10},
        ]
        schedule = scheduler.Scheduler(actions)
        schedule.start()

    def search_instagram(self):
        self.driver.get("https://www.instagram.com")

    def click_login(self):
        try:
            text = Scraper.BUTTON_TEXT["login"][self.lang]
            login_button = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            login_button.click()
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could find the Log In button")

    def login(self):
        try:
            self.driver.find_element_by_xpath("//input[@name='username']").send_keys(self.user)
            password_input = self.driver.find_element_by_xpath("//input[@name='password']")
            password_input.send_keys(self.pswd)
            password_input.submit()
            logger.info(f"[{self.user}] Logged in")
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could not log in")

    def close_reactivated(self):
        try:
            text = Scraper.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//a[contains(text(),'{text}')]")
            not_now_btn.click()
            logger.info(f"[{self.user}] Closed Reactivate popup")
        except NoSuchElementException:
            logger.warning(f"[{self.user}] Did not cancel Reactivate popup")

    def close_notification(self):
        try:
            text = Scraper.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            not_now_btn.click()
            logger.info(f"[{self.user}] Closed Allow Notifications popup")
        except NoSuchElementException:
            logger.warning(f"[{self.user}] Did not cancel Allow Notifications popup")

    def close_add_to_home(self):
        try:
            text = Scraper.BUTTON_TEXT["cancel"][self.lang]
            cancel_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            cancel_btn.click()
            logger.info(f"[{self.user}] Closed Add to Home popup")
        except NoSuchElementException:
            logger.warning(f"[{self.user}] Did not cancel Add to Home popup")

    def open_file_menu(self):
        try:
            self.driver.find_element_by_xpath("//div[@role='menuitem']").click()
            logger.info(f"[{self.user}] Opened the file menu")
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could not open the file menu")

    def send_file(self):
        try:
            input_field = self.driver.find_element_by_xpath(f"//input[@type=\"file\"]")
            input_field.send_keys(self.image)
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could not find file input")

    def next_step(self):
        try:
            text = Scraper.BUTTON_TEXT["next"][self.lang]
            next_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            next_btn.click()
            logger.info(f"[{self.user}] Submitted image")
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could not submit image")

    def write_caption(self):
        try:
            text = Scraper.BUTTON_TEXT["caption_aria"][self.lang]
            caption_field = self.driver.find_element_by_xpath(f"//textarea[@aria-label='{text}']")
            caption_field.send_keys(self.caption)
            logger.info(f"[{self.user}] Wrote caption")
        except NoSuchElementException:
            logger.warning(f"[{self.user}] Could write a caption")

    def share(self):
        try:
            text = Scraper.BUTTON_TEXT["share"][self.lang]
            share_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            share_btn.click()
            logger.info(f"[{self.user}] Shared image")
        except NoSuchElementException:
            logger.error(f"[{self.user}] Could not share image")
