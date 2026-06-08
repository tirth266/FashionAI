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
    """5. Validate Environment Variables: Log missing variables and fail fast on critical ones."""
    critical_vars = [
        "GOOGLE_CLIENT_ID",
        "SECRET_KEY",
        "MONGO_URI"
    ]
    optional_vars = [
        "GEMINI_API_KEY",
        "UPLOAD_FOLDER"
    ]
    
    logger.info("=== Environment Variable Audit ===")
    
    # Check Critical Variables
    missing_critical = []
    for var in critical_vars:
        value = os.getenv(var)
        if value:
            logger.info(f"[CONF] {var:20}: PRESENT")
        else:
            # Special check for MONGO_URI/MONGODB_URI fallback
            if var == "MONGO_URI":
                fallback = os.getenv("MONGODB_URI")
                if fallback:
                    logger.info(f"[CONF] {var:20}: PRESENT (via MONGODB_URI fallback)")
                    continue
            
            logger.error(f"[CONF] {var:20}: MISSING")
            missing_critical.append(var)

    # Check Optional Variables
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            logger.info(f"[CONF] {var:20}: PRESENT")
        else:
            logger.warning(f"[CONF] {var:20}: MISSING (Optional)")

    if missing_critical:
        logger.error(f"FATAL: MISSING CRITICAL ENV VARS: {', '.join(missing_critical)}")
        raise RuntimeError(f"Missing critical environment variables: {', '.join(missing_critical)}")
    
    # Basic URI scheme validation for MongoDB
    mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
    if mongo_uri and not (mongo_uri.startswith("mongodb://") or mongo_uri.startswith("mongodb+srv://")):
        prefix = mongo_uri.split("://")[0] if "://" in mongo_uri else "NO_SCHEME"
        logger.error(f"FATAL: Invalid MongoDB URI scheme: '{prefix}'")
        raise RuntimeError(f"Invalid MongoDB URI scheme: '{prefix}'. Must start with 'mongodb://' or 'mongodb+srv://'.")

    logger.info("All critical environment variables are verified.")
    logger.info("=================================")

def create_app():
    app = Flask(__name__)
    
    validate_env_vars()

    # Log registered routes at startup for debugging
    with app.app_context():
        logger.info("\n=== REGISTERED ROUTES ===")
        for rule in app.url_map.iter_rules():
            logger.info(f"{rule.endpoint:40s} {','.join(rule.methods):20s} {rule.rule}")
        logger.info("=========================\n")

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
    
    # Force SECRET_KEY to be what's in env, NO fallback in production for security
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

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
        config_status = {
            "SECRET_KEY": "set" if os.getenv("SECRET_KEY") else "missing",
            "GOOGLE_CLIENT_ID": "set" if os.getenv("GOOGLE_CLIENT_ID") else "missing",
            "MONGO_URI": "set" if (os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")) else "missing",
            "GEMINI_API_KEY": "set" if os.getenv("GEMINI_API_KEY") else "missing"
        }
        return jsonify({
            "status": "healthy",
            "config": config_status,
            "environment": os.getenv("FLASK_ENV", "production")
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

    @app.route("/api/debug/routes")
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                "endpoint": rule.endpoint,
                "methods": list(rule.methods),
                "rule": rule.rule
            })
        return jsonify({
            "total_routes": len(routes),
            "routes": routes
        }), 200

    @app.route("/api/debug/gemini")
    def test_gemini():
        try:
            from app.services.gemini_service import gemini_service
            # Test connectivity
            res = gemini_service.generate_response("Ping")
            status = gemini_service.get_status()
            
            return jsonify({
                "gemini_key_present": status["api_key_configured"],
                "gemini_client_initialized": status["gemini"] == "connected",
                "status": "ok" if res.get("success") else "error",
                "test_connectivity": "Success" if res.get("success") else "Failed",
                "response": res.get("response"),
                "error_details": res.get("error")
            }), 200
        except Exception as e:
            logger.error(f"Debug Gemini endpoint failed: {e}", exc_info=True)
            return jsonify({
                "status": "error",
                "details": str(e)
            }), 500

    @app.route("/api/test-db")
    def test_db():
        from app.db.mongo import db
        success, message = db.test_connection()
        if success:
            return jsonify({
                "success": True,
                "database": "fashionai",
                "status": "connected",
                "details": message
            }), 200
        else:
            return jsonify({
                "success": False,
                "status": "failed",
                "error": message
            }), 500

    # Register blueprints robustly
    blueprints = [
        ('app.api.recommendations', 'recommendations_bp', '/api/recommendations'),
        ('app.api.uploads', 'uploads_bp', '/api'),
        ('app.api.v1.routes.auth_routes', 'auth_bp', '/api/auth'),
        ('app.api.v1.routes.chat_routes', 'chat_bp', '/api/chat'),
        ('app.api.v1.routes.outfit_routes', 'outfit_bp', '/api/outfits'),
        ('app.api.v1.routes.trend_routes', 'trend_bp', '/api/trends'),
        ('app.api.v1.routes.user_routes', 'user_bp', '/api/user'),
    ]

    for module_path, bp_name, prefix in blueprints:
        try:
            module = __import__(module_path, fromlist=[bp_name])
            bp = getattr(module, bp_name)
            app.register_blueprint(bp, url_prefix=prefix)
            logger.info(f"Successfully registered blueprint: {bp_name} at {prefix}")
        except Exception as e:
            logger.error(f"CRITICAL: Failed to register blueprint {bp_name} from {module_path}: {e}")
            # We continue to register other blueprints even if one fails
    
    @app.after_request
    def add_security_headers(response):
        # Ensure CORS headers are present even for error responses
        if 'Access-Control-Allow-Origin' not in response.headers:
            origin = request.headers.get('Origin')
            if origin in ["https://fashion-ai-sand.vercel.app", "http://localhost:5173"]:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
        
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
