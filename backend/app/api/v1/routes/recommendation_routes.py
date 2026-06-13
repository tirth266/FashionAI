from flask import Blueprint, jsonify, request
from app.services.fashion_similarity_service import fashion_similarity_service
from app.services.faiss_service import faiss_service
import logging

logger = logging.getLogger(__name__)

recommendation_bp = Blueprint('recommendation_bp', __name__)

@recommendation_bp.route('/', methods=['GET'])
def get_recommendations():
    return jsonify({"message": "Get personalized recommendations"}), 200

@recommendation_bp.route('/similar', methods=['POST'])
def recommend_similar():
    """
    POST /api/recommendations/similar
    Receives an image and returns top 5 visually similar products.
    """
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided"}), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400

    try:
        # 1. Extract visual features using RegNet
        logger.info(f"Extracting features for uploaded image: {image_file.filename}")
        query_embedding = fashion_similarity_service.extract_features(image_file)
        
        # 2. Search FAISS index for top 5 matches
        recommendations = faiss_service.search_similar(query_embedding, top_k=5)
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        }), 200

    except Exception as e:
        logger.error(f"Error in similar recommendations: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Failed to process image and find recommendations",
            "details": str(e)
        }), 500
