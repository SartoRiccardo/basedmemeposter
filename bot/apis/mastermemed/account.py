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
        self.start_time = start_time
        self.end_time = end_time

    def toJson(self):
        return vars(self)
