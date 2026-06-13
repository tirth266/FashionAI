import jwt
from functools import wraps
from flask import request, jsonify, current_app
import os

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            secret = current_app.config.get('SECRET_KEY') or os.getenv("SECRET_KEY", "secret")
            data = jwt.decode(token, secret, algorithms=["HS256"])
            # You can attach user data to request if needed
            request.user = data
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated
