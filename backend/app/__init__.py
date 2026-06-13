import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# 1. Configure Production Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

def validate_env_vars():
    """Validate Environment Variables: Log missing variables and fail fast on critical ones."""
    critical_vars = [
        "GOOGLE_CLIENT_ID",
        "SECRET_KEY",
        "MONGO_URI",
        "GEMINI_API_KEY"
    ]
    
    logger.info("=== Environment Variable Audit ===")
    
    missing_critical = []
    for var in critical_vars:
        value = os.getenv(var)
        if value:
            logger.info(f"[CONF] {var:20}: PRESENT")
        else:
            if var == "MONGO_URI":
                fallback = os.getenv("MONGODB_URI")
                if fallback:
                    logger.info(f"[CONF] {var:20}: PRESENT (via MONGODB_URI fallback)")
                    continue
            
            logger.error(f"[CONF] {var:20}: MISSING")
            missing_critical.append(var)

    if missing_critical:
        logger.error(f"FATAL: MISSING CRITICAL ENV VARS: {', '.join(missing_critical)}")
        raise RuntimeError(f"Missing critical environment variables: {', '.join(missing_critical)}")
    
    logger.info("All critical environment variables verified.")

def create_app():
    app = Flask(__name__)
    
    # 1. Validate Env
    validate_env_vars()

    # 2. Configure CORS
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
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        expose_headers=["Content-Type", "Authorization"]
    )

    # 3. App Config
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # 4. Request Logging
    @app.before_request
    def log_incoming_request():
        logger.info(f"REQUEST: {request.method} {request.path} from {request.remote_addr}")

    # 5. Core Routes
    @app.route("/")
    def root():
        return jsonify({"status": "running", "service": "FashionAI Backend"}), 200

    @app.route("/health")
    def health():
        return jsonify({"status": "healthy", "environment": os.getenv("FLASK_ENV", "production")}), 200

    @app.route("/api")
    def api_root():
        return jsonify({"status": "api working"}), 200

    @app.route("/api/debug/routes")
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({"endpoint": rule.endpoint, "methods": list(rule.methods), "rule": rule.rule})
        return jsonify({"total_routes": len(routes), "routes": routes}), 200

    # 6. Blueprint Registration
    blueprints = [
        ('app.api.recommendations', 'recommendations_bp', '/api/recommendations'),
        ('app.api.uploads', 'uploads_bp', '/api'),
        ('app.api.v1.routes.auth_routes', 'auth_bp', '/api/auth'),
        ('app.api.v1.routes.chat_routes', 'chat_bp', '/api/chat'),
        ('app.api.v1.routes.outfit_routes', 'outfit_bp', '/api/outfits'),
        ('app.api.v1.routes.trend_routes', 'trend_bp', '/api/trends'),
        ('app.api.v1.routes.user_routes', 'user_bp', '/api/user'),
    ]

    logger.info("Registering Blueprints...")
    for module_path, bp_name, prefix in blueprints:
        try:
            logger.info(f"Importing {bp_name} from {module_path}")
            module = __import__(module_path, fromlist=[bp_name])
            bp = getattr(module, bp_name)
            app.register_blueprint(bp, url_prefix=prefix)
            logger.info(f"SUCCESS: Registered {bp_name} at {prefix}")
        except Exception as e:
            logger.error(f"FAILURE: Could not register {bp_name}: {str(e)}", exc_info=True)

    # 7. Post-Registration Audit
    with app.app_context():
        logger.info("\n=== FINAL REGISTERED ROUTES ===")
        for rule in app.url_map.iter_rules():
            logger.info(f"{rule.endpoint:40s} {','.join(rule.methods):20s} {rule.rule}")
        logger.info("================================\n")

    # 8. Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not Found", "path": request.path}), 404

    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"500 ERROR: {e}", exc_info=True)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

    return app

# Gunicorn Entrypoint
try:
    app = create_app()
except Exception as e:
    logger.critical(f"FATAL STARTUP ERROR: {e}", exc_info=True)
    app = Flask(__name__)
    CORS(app)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def emergency_fallback(path):
        return jsonify({"status": "emergency_mode", "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
