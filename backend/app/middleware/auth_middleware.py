from functools import wraps
from flask import request, jsonify
from app.core.security import decode_token
from app.models.user_model import User
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Expecting 'Bearer <token>'
            token_str = token.split(" ")[1] if " " in token else token
            payload = decode_token(token_str)
            if not payload:
                return jsonify({'message': 'Token is invalid!'}), 401
            
            user_id = payload.get("user_id")
            user = User.get_collection().find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return jsonify({'message': 'User not found!'}), 404
                
        except Exception as e:
            return jsonify({'message': 'Token processing error!'}), 401
            
        return f(user, *args, **kwargs)
    return decorated
