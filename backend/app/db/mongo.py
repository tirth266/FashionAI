import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI")
        if not self.uri:
            raise ValueError("MONGO_URI environment variable is not set")
        self.client = MongoClient(self.uri)
        self.db = self.client.get_database()

    def get_collection(self, name):
        return self.db[name]

db = MongoDB()
