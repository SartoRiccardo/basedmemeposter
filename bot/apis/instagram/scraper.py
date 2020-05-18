from apis.instagram import scheduler
import platform
import threading
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


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

    def __init__(self, user, pswd, image, caption, lang="eng"):
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

        self.logger = None

    def setLogger(self, logger):
        self.logger = logger

    def run(self):
        actions = [
            {"action": self.search_instagram, "wait": 3},
            {"action": self.click_login, "wait": 5},
            {"action": self.login, "wait": 10},
            {"action": self.close_reactivated, "wait": 10},
            {"action": self.close_notification, "wait": 10},
            {"action": self.close_add_to_home, "wait": 10},
            {"action": self.open_file_menu, "wait": 5},
            {"action": self.send_file, "wait": 7},
            {"action": self.expand_image, "wait": 10},
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
            if self.logger:
                self.logger.error("Could find the Log In button")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def login(self):
        try:
            self.driver.find_element_by_xpath("//input[@name='username']").send_keys(self.user)
            password_input = self.driver.find_element_by_xpath("//input[@name='password']")
            password_input.send_keys(self.pswd)
            password_input.submit()
            if self.logger:
                self.logger.debug("Logged in")
        except NoSuchElementException:
            if self.logger:
                self.logger.error("Could not log in")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def close_reactivated(self):
        try:
            text = Scraper.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//a[contains(text(),'{text}')]")
            not_now_btn.click()
            if self.logger:
                self.logger.debug("Closed Reactivate popup")
        except NoSuchElementException:
            if self.logger:
                self.logger.warning("Did not cancel Reactivate popup")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def close_notification(self):
        try:
            text = Scraper.BUTTON_TEXT["not_now"][self.lang]
            not_now_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            not_now_btn.click()
            if self.logger:
                self.logger.debug("Closed Allow Notifications popup")
        except NoSuchElementException:
            if self.logger:
                self.logger.warning("Did not cancel Allow Notifications popup")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def close_add_to_home(self):
        try:
            text = Scraper.BUTTON_TEXT["cancel"][self.lang]
            cancel_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            cancel_btn.click()
            if self.logger:
                self.logger.debug("Closed Add to Home popup")
        except NoSuchElementException:
            if self.logger:
                self.logger.warning("Did not cancel Add to Home popup")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def open_file_menu(self):
        try:
            self.driver.find_element_by_xpath("//div[@role='menuitem']").click()
            if self.logger:
                self.logger.debug("Opened the file menu")
        except NoSuchElementException:
            if self.logger:
                self.logger.error("Could not open the file menu")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def send_file(self):
        try:
            input_field = self.driver.find_element_by_xpath(f"//input[@type=\"file\"]")
            input_field.send_keys(self.image)
        except NoSuchElementException:
            if self.logger:
                self.logger.error("Could not find file input")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def next_step(self):
        try:
            text = Scraper.BUTTON_TEXT["next"][self.lang]
            next_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            next_btn.click()
            if self.logger:
                self.logger.debug("Submitted image")
        except NoSuchElementException:
            if self.logger:
                self.logger.error("Could not submit image")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def write_caption(self):
        try:
            text = Scraper.BUTTON_TEXT["caption_aria"][self.lang]
            caption_field = self.driver.find_element_by_xpath(f"//textarea[@aria-label='{text}']")
            caption_field.send_keys(self.caption)
            if self.logger:
                self.logger.debug("Wrote caption")
        except NoSuchElementException:
            if self.logger:
                self.logger.warning("Could write a caption")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def share(self):
        try:
            text = Scraper.BUTTON_TEXT["share"][self.lang]
            share_btn = self.driver.find_element_by_xpath(f"//button[contains(text(),'{text}')]")
            share_btn.click()
            if self.logger:
                self.logger.info("Shared image")
        except NoSuchElementException:
            if self.logger:
                self.logger.error("Could not share image")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)

    def expand_image(self):
        try:
            text = Scraper.BUTTON_TEXT["expand"][self.lang]
            expand_btn = self.driver.find_element_by_xpath(f"//span[contains(text(),'{text}')]")
            expand_btn.click()
            if self.logger:
                self.logger.debug("Image resized")
        except NoSuchElementException:
            if self.logger:
                self.logger.debug("Image could not be resized")
        except Exception as exc:
            if self.logger:
                self.logger.error(exc)
