import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/fashion_db")
        self.client = MongoClient(self.uri)
        self.db = self.client.get_database()

    def get_collection(self, name):
        return self.db[name]

db = MongoDB()
