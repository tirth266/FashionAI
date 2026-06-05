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
            raise ValueError("MongoDB Client not initialized. Check MONGO_URI environment variable.")
        if self._db is None:
            try:
                # EXPLICIT: Always use 'fashionai' as the database name 
                # This prevents the "No default database defined" error when using Atlas URIs
                # that don't specify a database name in the connection string.
                self._db = self.client[self.db_name]
                
                # Verify we can actually access the database
                self.client.admin.command('ping')
                logger.info(f"Successfully verified access to database: {self.db_name}")
            except Exception as e:
                logger.error(f"CRITICAL: Failed to initialize or verify database '{self.db_name}': {e}")
                raise
        return self._db

    def get_collection(self, name):
        """Get a collection from the database with robust error handling."""
        try:
            return self.db[name]
        except Exception as e:
            logger.error(f"ERROR: Failed to access collection '{name}' in database '{self.db_name}': {e}")
            raise

    def test_connection(self):
        """Test if the database is reachable and report status."""
        try:
            if not self.uri:
                return False, "MONGO_URI environment variable is missing"
            
            client = self.client
            if client:
                client.admin.command('ping')
                # Attempt to get database and list collections as a deep health check
                db = client[self.db_name]
                # Just trigger a check
                db.list_collection_names()
                return True, f"Connected to Atlas database: {self.db_name}"
            return False, "MongoDB Client failed to initialize"
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False, f"Connection failed: {str(e)}"

db = MongoDB()
