from flask import Blueprint, jsonify, request
from google.oauth2 import id_token
from google.auth.transport import requests
from app.models.user_model import User
from app.core.security import create_token
from app.core.config import Config
from app.middleware.auth_middleware import token_required

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if User.find_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    User.create(email, password, name=name)
    user = User.find_by_email(email)
    token = create_token({"user_id": str(user['_id']), "email": user['email']})
    
    return jsonify({
        "user": {"email": user['email'], "name": user.get('name')},
        "token": token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not User.verify_password(email, password):
        return jsonify({"message": "Invalid credentials"}), 401

    user = User.find_by_email(email)
    token = create_token({"user_id": str(user['_id']), "email": user['email']})

    return jsonify({
        "user": {"email": user['email'], "name": user.get('name')},
        "token": token
    }), 200

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({"success": False, "message": "No Google token provided"}), 400

        if not Config.GOOGLE_CLIENT_ID:
            logger.error("GOOGLE_CLIENT_ID is not configured in backend.")
            return jsonify({"success": False, "message": "Backend configuration error: Missing Google Client ID"}), 500

        # Token verification logic
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                Config.GOOGLE_CLIENT_ID
            )
        except ValueError as ve:
            return jsonify({"success": False, "message": "Invalid Google token", "error": str(ve)}), 400

        email = idinfo['email']
        google_id = idinfo['sub']
        name = idinfo.get('name', email.split('@')[0])
        picture = idinfo.get('picture')

        user = User.find_by_google_id(google_id)

        if not user:
            user = User.find_by_email(email)
            if user:
                User.update_profile(user['_id'], {
                    "google_id": google_id,
                    "profile_picture": picture,
                    "auth_provider": "google"
                })
            else:
                User.create(email, google_id=google_id, name=name, profile_picture=picture, auth_provider="google")
            user = User.find_by_email(email)

        jwt_token = create_token({"user_id": str(user['_id']), "email": user['email']})

        return jsonify({
            "success": True,
            "user": {
                "email": user['email'],
                "name": user.get('name'),
                "profile_picture": user.get('profile_picture')
            },
            "token": jwt_token
        }), 200

    except Exception as e:
        logger.error(f"Google Auth Exception: {str(e)}")
        return jsonify({
            "success": False, 
            "message": "Authentication failed", 
            "error": str(e)
        }), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({
        "user": {
            "email": current_user['email'],
            "name": current_user.get('name'),
            "profile_picture": current_user.get('profile_picture')
        }
    }), 200
