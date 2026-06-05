import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

class MongoDB:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI")
        self.db_name = "fashionai"
        self._client = None
        self._db = None

    @property
    def client(self):
        if self._client is None:
            if not self.uri:
                logger.error("CRITICAL: MONGO_URI is not set in environment variables.")
                return None # Return None to allow health checks to report status
            try:
                # Use a reasonable timeout for server selection
                self._client = MongoClient(self.uri, serverSelectionTimeoutMS=5000)
                # Verify connection
                self._client.admin.command('ping')
                logger.info("Successfully connected to MongoDB Atlas")
            except Exception as e:
                logger.error(f"CRITICAL: Failed to connect to MongoDB: {e}")
                self._client = None
                raise
        return self._client

    @property
    def db(self):
        if self.client is None:
            raise ValueError("MongoDB Client not initialized. Check MONGO_URI.")
        if self._db is None:
            try:
                # If the URI contains a database name, use it; otherwise default to fashionai
                db_name_from_uri = self.client.get_database().name
                if db_name_from_uri == "test" or not db_name_from_uri:
                    self._db = self.client[self.db_name]
                else:
                    self._db = self.client.get_database()
                logger.info(f"Using database: {self._db.name}")
            except Exception as e:
                logger.error(f"CRITICAL: Database initialization failure: {e}")
                raise
        return self._db

    def get_collection(self, name):
        """Get a collection from the database with error handling."""
        try:
            return self.db[name]
        except Exception as e:
            logger.error(f"Failed to access collection '{name}': {e}")
            raise

    def test_connection(self):
        """Test if the database is reachable."""
        try:
            if not self.uri:
                return False, "MONGO_URI missing"
            if self.client:
                self.client.admin.command('ping')
                return True, "MongoDB Connected"
            return False, "Client not initialized"
        except Exception as e:
            return False, str(e)

db = MongoDB()
