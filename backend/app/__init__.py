import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Apply production-ready CORS configuration
    CORS(
        app,
        origins=[
            "https://fashion-ai-sand.vercel.app",
            "http://localhost:5173"
        ],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # Configuration
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Health Check (Requirement #5)
    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    # Root Route (Requirement #6)
    @app.route("/")
    def root():
        return {"message": "Backend Running"}, 200

    # API Debug Route (Requirement #7)
    @app.route("/api")
    def api_debug():
        return {"status": "api working"}, 200

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
        logger.info("All blueprints registered successfully.")
    except Exception as e:
        logger.error(f"Error registering blueprints: {e}")
        # We still want the app to start so we can see the /health status

    @app.after_request
    def add_security_headers(response):
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
        return response

    return app

# For Gunicorn/WSGI
# We use a global app object but ensure it's created safely
try:
    app = create_app()
except Exception as e:
    logger.critical(f"Failed to create app: {e}")
    # Fallback minimal app to report error instead of 502
    app = Flask(__name__)
    @app.route('/')
    @app.route('/health')
    @app.route('/api')
    def crash_report():
        return {"status": "error", "message": str(e)}, 500

if __name__ == "__main__":
    # Standard Render port is often 10000 if not specified
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
