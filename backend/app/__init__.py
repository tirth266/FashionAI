import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Strict CORS for production safety
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:5173",
        "https://fashion-ai-frontend.vercel.app", 
        "https://*.vercel.app"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Configuration
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Register blueprints with consistent /api prefixing
from app.api.recommendations import recommendations_bp
from app.api.uploads import uploads_bp
from app.api.v1.routes.auth_routes import auth_bp

# Note: Blueprints themselves may have prefixes, we consolidate them here.
app.register_blueprint(recommendations_bp, url_prefix='/api')
app.register_blueprint(uploads_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/health')
def health_check():
    return {"status": "healthy", "model": "RegNetY-400MF active"}, 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
