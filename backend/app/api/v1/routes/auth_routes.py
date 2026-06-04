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

@auth_bp.route('/google', methods=['POST', 'OPTIONS'])
def google_auth():
    # 4. Explicitly support OPTIONS requests
    if request.method == "OPTIONS":
        return "", 200

    # 8. Detailed Logging
    logger.info("Processing /api/auth/google POST request")
    
    try:
        data = request.get_json()
        if not data:
            logger.warning("Google Auth: No JSON data received")
            return jsonify({"success": False, "message": "Missing request body"}), 400
            
        token = data.get('token')
        if not token:
            logger.warning("Google Auth: No token provided in JSON")
            return jsonify({"success": False, "message": "No Google token provided"}), 400

        if not Config.GOOGLE_CLIENT_ID:
            logger.error("GOOGLE_CLIENT_ID is not configured in backend.")
            return jsonify({"success": False, "message": "Backend configuration error: Missing Google Client ID"}), 500

        # Token verification logic
        try:
            logger.info(f"Verifying Google token for Client ID: {Config.GOOGLE_CLIENT_ID[:10]}...")
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                Config.GOOGLE_CLIENT_ID
            )
            logger.info("Google Token verified successfully")
        except ValueError as ve:
            logger.error(f"Google Token Validation Error: {str(ve)}")
            return jsonify({"success": False, "message": "Invalid Google token", "error": str(ve)}), 400

        email = idinfo['email']
        google_id = idinfo['sub']
        name = idinfo.get('name', email.split('@')[0])
        picture = idinfo.get('picture')

        logger.info(f"Authenticating user: {email}")

        user = User.find_by_google_id(google_id)

        if not user:
            logger.info(f"User {email} not found by Google ID, checking email...")
            user = User.find_by_email(email)
            if user:
                logger.info(f"Linking Google ID to existing user: {email}")
                User.update_profile(user['_id'], {
                    "google_id": google_id,
                    "profile_picture": picture,
                    "auth_provider": "google"
                })
            else:
                logger.info(f"Creating new user from Google: {email}")
                User.create(email, google_id=google_id, name=name, profile_picture=picture, auth_provider="google")
            user = User.find_by_email(email)

        jwt_token = create_token({"user_id": str(user['_id']), "email": user['email']})
        logger.info(f"Authentication successful for {email}. JWT issued.")

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
        logger.error(f"Google Auth Global Exception: {str(e)}", exc_info=True)
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
