from datetime import datetime, timedelta, timezone
import time
from base64 import b64decode
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto import Random
from config import config


PRIVATE_KEY = config("mastermemed", "private-key")


def decrypt(encrypted):
    key = RSA.importKey(PRIVATE_KEY)
    sentinel = Random.new().read(256)
    cipher = PKCS1_v1_5.new(key)
    return cipher.decrypt(b64decode(encrypted), sentinel).decode("utf-8")


class Account:
    def __init__(self, username, password, start_time, end_time, password_is_encrypted=True, id=None):
        self.id = id
        self.username = username
        self.password = decrypt(password) if password_is_encrypted else password
        self.start_time = start_time if not isinstance(start_time, str) else \
            datetime.fromtimestamp(
                time.mktime(
                    time.strptime(start_time, "%H:%M:%S")
                )
            ).replace(tzinfo=timezone.utc)
        self.end_time = end_time if not isinstance(end_time, str) else \
            datetime.fromtimestamp(
                time.mktime(
                    time.strptime(end_time, "%H:%M:%S")
                )
            ).replace(tzinfo=timezone.utc)

    def timeOnline(self):
        if self.start_time > self.end_time:
            day_start = time.mktime(time.strptime("00:00:00", "%H:%M:%S"))
            next_day = time.mktime(time.strptime("02 00:00:00", "%d %H:%M:%S"))
            return timedelta(seconds=(
                (datetime.timestamp(self.end_time) - day_start) +
                (next_day - datetime.timestamp(self.start_time))
            ))

        return timedelta(seconds=(
                datetime.timestamp(self.end_time) - datetime.timestamp(self.start_time)
        ))

    def inTimeRange(self, time: datetime):
        """
        Checks if the given time is in range
        :param time: datetime.datetime: The time to check. The date does not matter.
        :return: boolean
        """
        no_date_time = time.replace(year=2000, month=1, day=1)
        start = self.start_time.replace(year=2000, month=1, day=1)
        end = self.end_time.replace(year=2000, month=1, day=1)
        if self.end_time < self.start_time:
            return start < no_date_time or no_date_time < end

        return start <= no_date_time < end

    def toJson(self):
        return vars(self)
