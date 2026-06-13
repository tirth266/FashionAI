from functools import wraps
from flask import request, jsonify
from app.core.security import decode_token
from app.models.user_model import User
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return f(None, *args, **kwargs)

        token = request.headers.get('Authorization')
        if not token:
            logger.warning("Auth Middleware: Token is missing from request headers.")
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Expecting 'Bearer <token>'
            token_str = token.split(" ")[1] if " " in token else token
            payload = decode_token(token_str)
            if not payload:
                logger.warning(f"Auth Middleware: Token decoding failed or token expired. Token string snippet: {token_str[:15]}...")
                return jsonify({'message': 'Token is invalid or expired!'}), 401
            
            user_id = payload.get("user_id")
            if not user_id:
                logger.warning("Auth Middleware: user_id missing from token payload.")
                return jsonify({'message': 'Token is invalid: missing user_id!'}), 401

            user = User.get_collection().find_one({"_id": ObjectId(user_id)})
            
            if not user:
                logger.warning(f"Auth Middleware: User not found in database for user_id: {user_id}")
                return jsonify({'message': 'User not found!'}), 404
                
        except Exception as e:
            logger.error(f"Auth Middleware: Token processing error! Details: {str(e)}", exc_info=True)
            return jsonify({'message': 'Token processing error!'}), 401
            
        return f(user, *args, **kwargs)
    return decorated

