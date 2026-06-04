import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

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

    # Register blueprints
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

    @app.after_request
    def add_security_headers(response):
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
        return response

    @app.route('/')
    def index():
        return jsonify({
            "name": "Fashion AI API",
            "status": "healthy",
            "version": "1.0.0"
        }), 200

    @app.route('/health')
    def health_check():
        return {"status": "healthy", "model": "RegNetY-400MF ready"}, 200

    return app

# For Gunicorn/WSGI
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
