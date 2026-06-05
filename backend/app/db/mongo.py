import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
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
                logger.error("CRITICAL: MONGO_URI is not set in environment variables.")
                raise ValueError("MONGO_URI environment variable is missing. Check Render Dashboard.")
            try:
                self._client = MongoClient(self.uri, serverSelectionTimeoutMS=5000)
                # Quick connectivity check
                self._client.admin.command('ping')
                logger.info("Successfully connected to MongoDB")
            except Exception as e:
                logger.error(f"CRITICAL: Failed to connect to MongoDB: {e}")
                raise
        return self._client

    @property
    def db(self):
        if self._db is None:
            try:
                # Trigger client connection
                client = self.client
                self._db = client.get_database()
                logger.info(f"Database initialized: {self._db.name}")
            except Exception as e:
                logger.error(f"CRITICAL: Database initialization failure: {e}")
                raise
        return self._db

    def get_collection(self, name):
        try:
            return self.db[name]
        except Exception as e:
            logger.error(f"Failed to get collection {name}: {e}")
            raise

db = MongoDB()
