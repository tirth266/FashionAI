import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# 1. Audit & Fix Flask Startup: Configure Production Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

def validate_env_vars():
    """5. Validate Environment Variables: Log missing variables without crashing."""
    required_vars = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "SECRET_KEY",
        "MONGO_URI"
    ]
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        logger.warning(f"CRITICAL: MISSING ENV VARS: {', '.join(missing)}")
    else:
        logger.info("All required environment variables are verified.")

def create_app():
    app = Flask(__name__)
    
    validate_env_vars()

    # 2 & 3. Fix CORS: Production-ready configuration with explicit resource mapping
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "https://fashion-ai-sand.vercel.app",
                    "http://localhost:5173"
                ]
            },
            r"/health": {"origins": "*"},
            r"/": {"origins": "*"}
        },
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # Configuration
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-fallback')

    # 8. Detailed Logging: Log all incoming requests for debugging
    @app.before_request
    def log_incoming_request():
        logger.info(f"REQUEST: {request.method} {request.path} from {request.remote_addr}")
        if request.method == "OPTIONS":
            logger.info(f"OPTIONS Preflight for {request.path}")

    # 3. Add Health Endpoints
    @app.route("/")
    def root():
        return jsonify({
            "status": "running",
            "service": "FashionAI Backend",
            "info": "ROOT"
        }), 200

    @app.route("/health")
    def health():
        return jsonify({
            "status": "healthy"
        }), 200

    @app.route("/api")
    def api_root():
        return jsonify({
            "status": "api working"
        }), 200

    # 7 & 9. Add Error Handlers with CORS support
    @app.errorhandler(404)
    def not_found(e):
        logger.warning(f"404 Not Found: {request.path}")
        return jsonify({"error": "Not Found", "path": request.path}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        logger.warning(f"405 Method Not Allowed: {request.method} {request.path}")
        return jsonify({"error": "Method Not Allowed"}), 405

    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"500 Internal Server Error: {e}", exc_info=True)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

    # Register blueprints
    try:
        from app.api.recommendations import recommendations_bp
        from app.api.uploads import uploads_bp
        from app.api.v1.routes.auth_routes import auth_bp
        from app.api.v1.routes.chat_routes import chat_bp
        from app.api.v1.routes.outfit_routes import outfit_bp
        from app.api.v1.routes.trend_routes import trend_bp
        from app.api.v1.routes.user_routes import user_bp

        app.register_blueprint(recommendations_bp, url_prefix='/api')
        app.register_blueprint(uploads_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(chat_bp, url_prefix='/api/chat')
        app.register_blueprint(outfit_bp, url_prefix='/api/outfits')
        app.register_blueprint(trend_bp, url_prefix='/api/trends')
        app.register_blueprint(user_bp, url_prefix='/api/user')
        logger.info("Blueprints registered successfully.")
    except Exception as e:
        logger.error(f"Blueprint Registration Failure: {e}", exc_info=True)

    @app.after_request
    def add_security_headers(response):
        # 9. Ensure CORS headers are returned even when exceptions occur
        # Flask-CORS handles most of this, but we add COOP for Google OAuth specifically
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
        return response

    return app

# 6. For Gunicorn/WSGI
try:
    app = create_app()
except Exception as e:
    logger.critical(f"FATAL APP CREATION FAILURE: {e}", exc_info=True)
    # Emergency fallback app
    app = Flask(__name__)
    CORS(app) # Enable CORS even on fallback
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def emergency_fallback(path):
        return jsonify({"status": "emergency_mode", "reason": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
