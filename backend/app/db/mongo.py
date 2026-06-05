import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

class MongoDB:
    def __init__(self):
        # Support both MONGO_URI and MONGODB_URI
        raw_uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
        self.uri = raw_uri.strip().strip("'").strip('"') if raw_uri else None
        self.db_name = "fashionai"
        self._client = None
        self._db = None
        
        # Immediate validation on startup
        if not self.uri:
            logger.error("CRITICAL: MongoDB URI not found. Set MONGO_URI or MONGODB_URI.")
        else:
            # Secure debug logging
            prefix = self.uri.split("://")[0] if "://" in self.uri else "NO_SCHEME"
            # Log URI existence and scheme without secrets
            logger.info(f"MongoDB URI found. Scheme: {prefix} (length: {len(self.uri)})")
            
            if not (self.uri.startswith("mongodb://") or self.uri.startswith("mongodb+srv://")):
                logger.error(f"CRITICAL: Invalid MongoDB URI scheme. Must start with 'mongodb://' or 'mongodb+srv://'. Found: '{prefix}'")
                # We don't raise here yet to allow the app to potentially report the error via health checks
                # but we will fail fast in the client property.

    @property
    def client(self):
        if self._client is None:
            if not self.uri:
                raise RuntimeError("MongoDB URI not found. Set MONGO_URI or MONGODB_URI environment variable.")
            
            if not (self.uri.startswith("mongodb://") or self.uri.startswith("mongodb+srv://")):
                prefix = self.uri.split("://")[0] if "://" in self.uri else "NO_SCHEME"
                raise RuntimeError(f"Invalid MongoDB URI scheme: '{prefix}'. Must start with 'mongodb://' or 'mongodb+srv://'.")

            try:
                # Use a reasonable timeout for server selection
                logger.info("Initializing MongoClient with verified URI scheme...")
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
