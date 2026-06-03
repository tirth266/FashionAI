from app.db.mongo import db
from datetime import datetime
from bson import ObjectId

class FashionItem:
    collection = db.get_collection("fashion_items")

    @classmethod
    def create(cls, data):
        data["created_at"] = datetime.utcnow()
        return cls.collection.insert_one(data)

    @classmethod
    def find_by_id(cls, item_id):
        return cls.collection.find_one({"_id": ObjectId(item_id)})

    @classmethod
    def get_all(cls, filter_query=None):
        return list(cls.collection.find(filter_query or {}))
