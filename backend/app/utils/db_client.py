from pymongo import MongoClient
from app.core.config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_default_database()

def get_db():
    return db
