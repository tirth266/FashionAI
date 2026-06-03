from functools import wraps
from flask import request, jsonify
from app.core.security import decode_token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # Expecting 'Bearer <token>'
        token_str = token.split(" ")[1] if " " in token else token
        payload = decode_token(token_str)
        if not payload:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(*args, **kwargs)
    return decorated
