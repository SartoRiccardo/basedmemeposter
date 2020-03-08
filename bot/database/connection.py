from database.config import *


class Connection:
    def __init__(self):
        self.f = open("test/dump.sql", "w")

    def execute(self, query):
        self.f.write(query)

    def close(self, query):
        self.f.close()


dbc = Connection()
