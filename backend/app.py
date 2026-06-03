import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Import routes
from app.api.recommendations import recommendations_bp
from app.api.uploads import uploads_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    app.register_blueprint(recommendations_bp, url_prefix='/api')
    app.register_blueprint(uploads_bp, url_prefix='/api')

    @app.route('/health')
    def health_check():
        return {"status": "healthy", "model": "RegNetY-16GF active"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
