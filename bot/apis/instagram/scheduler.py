from time import sleep
from random import random


class Scheduler:
    def __init__(self, actions):
        self.actions = actions
        self.active = True

    def start(self):
        self.active = True
        noise = 0.3
        for a in self.actions:
            try:
                action, wait = a["action"], a["wait"]
                wait_min, wait_max = wait*(1-noise), wait*(1+noise)
                wait = (random() * (wait_max-wait_min)) + wait_min

                action()
                sleep(wait)
            except:
                break
