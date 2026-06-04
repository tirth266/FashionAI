import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI")
        self._client = None
        self._db = None

    @property
    def client(self):
        if self._client is None:
            if not self.uri:
                # Log but don't crash the whole app at import time
                print("CRITICAL: MONGO_URI is not set in environment variables.")
                # We return a dummy client or wait? 
                # Better to raise a more descriptive error when actually accessed
                raise ValueError("MONGO_URI environment variable is missing. Check Render Dashboard.")
            self._client = MongoClient(self.uri, serverSelectionTimeoutMS=5000)
        return self._client

    @property
    def db(self):
        if self._db is None:
            # This will trigger client property and connection check
            try:
                self._db = self.client.get_database()
                # Check connection
                self._client.server_info() 
            except Exception as e:
                print(f"CRITICAL: Failed to connect to MongoDB: {e}")
                raise
        return self._db

    def get_collection(self, name):
        return self.db[name]

db = MongoDB()
