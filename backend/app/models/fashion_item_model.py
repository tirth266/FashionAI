from app.db.mongo import db
from datetime import datetime
from bson import ObjectId

class FashionItem:
    @classmethod
    def get_collection(cls):
        """Lazy access to collection to avoid DB connection at import time."""
        return db.get_collection("fashion_items")

    @classmethod
    def create(cls, data):
        data["created_at"] = datetime.utcnow()
        return cls.get_collection().insert_one(data)

    @classmethod
    def find_by_id(cls, item_id):
        return cls.get_collection().find_one({"_id": ObjectId(item_id)})

    @classmethod
    def get_all(cls, filter_query=None):
        return list(cls.get_collection().find(filter_query or {}))
