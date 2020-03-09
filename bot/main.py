from config import USER, PSWD
from time import sleep
from random import random
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
import platform
if platform.system() == "Linux":
    pass
elif platform.system() == "Darwin":
    pass
elif platform.system() == "Windows":
    raise Exception("Windows not supported")


class Scheduler:
    def __init__(self, actions):
        self.actions = actions

    def start(self):
        noise = 0.3
        for a in self.actions:
            action, wait = a["action"], a["wait"]
            wait_min, wait_max = wait*(1-noise), wait*(1+noise)
            wait = (random() * (wait_max-wait_min)) + wait_min

            action()
            #sleep(wait)

            print(f"Performed {action.__name__}. Wait for...")
            for passed in range(int(wait)):
                print(f"{int(wait)-passed}")
                sleep(1)
            print("\n"*20)


class InstagramPoster:
    BUTTON_TEXT = {
        "not_now": {
            "ita": "Non ora",
            "eng": "Not Now",
        },
        "login": {
            "ita": "Accedi",
            "eng": "Log In",
        },
        "cancel": {
            "ita": "Annulla",
            "eng": "Cancel",
        },
        "next": {
            "ita": None,
            "eng": "Next",
        },
        "caption_aria": {
            "ita": None,
            "eng": "Write a caption…",
        },
        "share": {
            "ita": None,
            "eng": "Share",
        },
    }

    def __init__(self, lang):
        self.lang = lang

        self.user = None
        self.pswd = None
        self.image = None
        self.caption = None

        # Initialize Driver
        chromedriver = None
        if platform.system() == "Linux":
            chromedriver = "./webdrivers/linux"
        elif platform.system() == "Darwin":
            chromedriver = "./webdrivers/macos"
        elif platform.system() == "Windows":
            raise Exception("Windows not supported")

        mobile = webdriver.ChromeOptions()
        mobile.add_argument("--headless")
        mobile.add_experimental_option("mobileEmulation", {"deviceName": "Pixel 2"})

        self.driver = webdriver.Chrome(
            executable_path=chromedriver,
            options=mobile
        )

    def post(self, user, pswd, image, caption):
        self.user = user
        self.pswd = pswd
        self.image = image
        self.caption = caption

        schedule = Scheduler([
            {"action": self.search_instagram, "wait": 3},#10},
            {"action": self.click_login, "wait": 5},
            {"action": self.login, "wait": 10},
            {"action": self.close_reactivated, "wait": 10},
            {"action": self.close_notification, "wait": 10},
            {"action": self.close_add_to_home, "wait": 10},
            {"action": self.open_file_menu, "wait": 5},
            {"action": self.select_file, "wait": 10},
            #{"action": self.next_step, "wait": 10},
            #{"action": self.write_caption, "wait": 10},
            #{"action": self.share, "wait": 10},
        ])
        schedule.start()

        self.user = None
        self.pswd = None
        self.image = None
        self.caption = None

    def search_instagram(self):
        self.driver.get("https://www.instagram.com")

    def click_login(self):
        text = InstagramPoster.BUTTON_TEXT["login"][self.lang]
        login_button = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
        login_button.click()

    def login(self):
        self.driver.find_element_by_xpath("//input[@name='username']").send_keys(self.user)
        password_input = self.driver.find_element_by_xpath("//input[@name='password']")
        password_input.send_keys(self.pswd)
        password_input.submit()

    def close_reactivated(self):
        try:
            text = InstagramPoster.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//a[contains(text(),'{text}')]")
            not_now_btn.click()
        except NoSuchElementException:
            pass

    def close_notification(self):
        try:
            text = InstagramPoster.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            not_now_btn.click()
        except NoSuchElementException:
            pass

    def close_add_to_home(self):
        try:
            text = InstagramPoster.BUTTON_TEXT["cancel"][self.lang]
            cancel_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            cancel_btn.click()
        except NoSuchElementException:
            pass

    def open_file_menu(self):
        self.driver.find_element_by_xpath("//div[@role='menuitem']").click()

    def select_file(self):
        if platform.system() == "Linux":
            pass
        elif platform.system() == "Darwin":
            pass
        elif platform.system() == "Windows":
            pass

    def next_step(self):
        text = InstagramPoster.BUTTON_TEXT["next"][self.lang]
        next_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
        next_btn.click()

    def write_caption(self):
        text = InstagramPoster.BUTTON_TEXT["caption_aria"][self.lang]
        caption_field = self.driver.find_element_by_xpath(f"//textarea[@aria-label='{text}']")
        caption_field.send_keys(self.caption)

    def share(self):
        text = InstagramPoster.BUTTON_TEXT["share"][self.lang]
        share_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
        share_btn.click()


InstagramPoster("eng").post(USER, PSWD, None, None)
