import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Apply CORS to ALL routes (/*) to prevent "Unsafe attempt" errors on root/redirects
CORS(app, resources={r"/*": {
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

app.register_blueprint(recommendations_bp, url_prefix='/api')
app.register_blueprint(uploads_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def index():
    return jsonify({
        "name": "Fashion AI API",
        "status": "healthy",
        "endpoints": ["/api/auth", "/api/recommend", "/api/upload-image"]
    }), 200

@app.route('/health')
def health_check():
    return {"status": "healthy", "model": "RegNetY-400MF active"}, 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
