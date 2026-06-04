import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Enhanced CORS for production
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:5173",
        "https://fashion-ai-frontend.vercel.app", # Add your actual Vercel URL here
        "https://*.vercel.app"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

if not os.getenv("GOOGLE_CLIENT_ID"):
    print("WARNING: GOOGLE_CLIENT_ID not set. Google Auth will fail.")

# Configuration
# Use /tmp for serverless environments or an environment variable
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Register blueprints (imported inside to avoid circular dependencies)
from app.api.recommendations import recommendations_bp
from app.api.uploads import uploads_bp
from app.api.v1.routes.auth_routes import auth_bp

app.register_blueprint(recommendations_bp, url_prefix='/api')
app.register_blueprint(uploads_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/health')
def health_check():
    return {"status": "healthy", "model": "RegNetY-400MF active"}, 200

