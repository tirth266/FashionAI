from app.db.mongo import db
from datetime import datetime
from bson import ObjectId
import hashlib

class User:
    collection = db.get_collection("users")

    @classmethod
    def create(cls, email, password, **kwargs):
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        user_data = {
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow(),
            **kwargs
        }
        return cls.collection.insert_one(user_data)

    @classmethod
    def find_by_email(cls, email):
        return cls.collection.find_one({"email": email})

    @classmethod
    def verify_password(cls, email, password):
        user = cls.find_by_email(email)
        if not user:
            return False
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        return user["password_hash"] == password_hash
