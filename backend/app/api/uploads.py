import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.ai.embeddings.feature_extractor import FeatureExtractor
from datetime import datetime

uploads_bp = Blueprint('uploads', __name__)
extractor = FeatureExtractor()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@uploads_bp.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        upload_path = os.path.join('uploads', filename)
        file.save(upload_path)
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "path": upload_path
        }), 201
    
    return jsonify({"error": "File type not allowed"}), 400

@uploads_bp.route('/extract-features', methods=['POST'])
def extract_features():
    data = request.json
    image_path = data.get('image_path')
    
    if not image_path or not os.path.exists(image_path):
        return jsonify({"error": "Invalid image path"}), 400
    
    try:
        embedding = extractor.extract(image_path)
        return jsonify({
            "embedding": embedding,
            "dimension": len(embedding)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
