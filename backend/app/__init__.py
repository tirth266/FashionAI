import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Restrict CORS to specific domains in production, or allow all for dev
CORS(app, resources={r"/*": {"origins": "*"}})

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

