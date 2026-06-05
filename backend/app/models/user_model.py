from app.db.mongo import db
from datetime import datetime
from bson import ObjectId
import hashlib

class User:
    @classmethod
    def get_collection(cls):
        """Lazy access to collection to avoid DB connection at import time."""
        return db.get_collection("users")

    @classmethod
    def create(cls, email, password=None, **kwargs):
        user_data = {
            "email": email,
            "created_at": datetime.utcnow(),
            "auth_provider": kwargs.get("auth_provider", "email"),
            **kwargs
        }
        
        if password:
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            user_data["password_hash"] = password_hash
            
        result = cls.get_collection().insert_one(user_data)
        return result

    @classmethod
    def find_by_email(cls, email):
        return cls.get_collection().find_one({"email": email})

    @classmethod
    def find_by_google_id(cls, google_id):
        return cls.get_collection().find_one({"google_id": google_id})

    @classmethod
    def update_profile(cls, user_id, update_data):
        return cls.get_collection().update_one(
            {"_id": ObjectId(user_id) if isinstance(user_id, str) else user_id},
            {"$set": update_data}
        )

    @classmethod
    def verify_password(cls, email, password):
        user = cls.find_by_email(email)
        if not user or "password_hash" not in user:
            return False
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        return user["password_hash"] == password_hash
