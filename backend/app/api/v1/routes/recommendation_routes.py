from flask import Blueprint, request, jsonify
from app.services.fashion_similarity_service import fashion_similarity_service
from app.services.faiss_service import faiss_service
from app.middleware.jwt_required import jwt_required
import os
import werkzeug
import logging

logger = logging.getLogger(__name__)

recommendation_bp = Blueprint('recommendation_bp', __name__)

@recommendation_bp.route('/', methods=['GET'])
def list_recommendations():
    """
    GET /api/recommendations/
    Returns info about the recommendation service.
    """
    return jsonify({
        "message": "Fashion Recommendation Service is Active",
        "endpoints": {
            "similar": "POST /api/recommendations/similar - Find similar products by image"
        }
    }), 200

@recommendation_bp.route('/recommend', methods=['POST', 'OPTIONS'])
@jwt_required
def get_recommendations():
    """
    POST /api/recommendations/recommend
    Legacy endpoint, now deprecated.
    """
    if request.method == "OPTIONS":
        return "", 200
        
    return jsonify({
        "success": False,
        "error": "This endpoint is deprecated.",
        "details": "Please use POST /api/recommendations/similar for the new memory-optimized recommendation engine."
    }), 410

@recommendation_bp.route('/similar', methods=['POST', 'OPTIONS'])
def recommend_similar():
    """
    POST /api/recommendations/similar
    Receives an image and returns top 5 visually similar products.
    """
    if request.method == "OPTIONS":
        return "", 200
        
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided"}), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400

    # 1. Image Size & Format Validation
    allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
    if '.' not in image_file.filename or image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"success": False, "error": "Invalid file format. Allowed: PNG, JPG, JPEG, WEBP"}), 400

    if request.content_length and request.content_length > 5 * 1024 * 1024:
        return jsonify({"success": False, "error": "File too large. Maximum size is 5MB."}), 413

    try:
        # 2. Extract visual features using deep learning
        logger.info(f"Extracting features for uploaded image: {image_file.filename}")
        query_embedding = fashion_similarity_service.extract_features(image_file)
        
        # 3. Search FAISS index for matches
        logger.info("Searching FAISS index...")
        recommendations = faiss_service.search_similar(query_embedding, top_k=5)
        
        # Bonus: Add heuristic metadata
        for rec in recommendations:
            name_lower = rec['name'].lower()
            if 'hoodie' in name_lower:
                rec['category'] = 'Hoodie'
                rec['tags'] = ['Streetwear', 'Casual', 'Winter']
            elif 'tee' in name_lower or 'shirt' in name_lower:
                rec['category'] = 'T-Shirt'
                rec['tags'] = ['Essential', 'Summer', 'Casual']
            elif 'jeans' in name_lower:
                rec['category'] = 'Pants'
                rec['tags'] = ['Denim', 'Classic', 'All-season']
            elif 'sneakers' in name_lower or 'shoes' in name_lower:
                rec['category'] = 'Footwear'
                rec['tags'] = ['Athletic', 'Trendy', 'Comfort']
            else:
                rec['category'] = 'Fashion'
                rec['tags'] = ['Style', 'Modern']
            
            # Mock color extraction
            colors = []
            if 'black' in name_lower: colors.append('Black')
            if 'white' in name_lower: colors.append('White')
            if 'blue' in name_lower: colors.append('Blue')
            if 'red' in name_lower: colors.append('Red')
            rec['colors'] = colors if colors else ['Multicolor']

        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "analysis": {
                "detected_category": recommendations[0]['category'] if recommendations else "Unknown",
                "style_detected": "Modern/Casual"
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in similar recommendations: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to process image and find recommendations",
            "details": str(e)
        }), 500
