from flask import Blueprint, request, jsonify
from app.services.recommendation_service import RecommendationService
from app.services.fashion_similarity_service import fashion_similarity_service
from app.services.faiss_service import faiss_service
from app.middleware.jwt_required import jwt_required
import os
import werkzeug
import logging

logger = logging.getLogger(__name__)

recommendations_bp = Blueprint('recommendations', __name__)
# Initialize service (this will load the model and index fashion items)
recommender = RecommendationService()

@recommendations_bp.route('/recommend', methods=['POST', 'OPTIONS'])
@jwt_required
def get_recommendations():
    # Log for CORS debugging
    logger.info(f"Recommendation Request - Method: {request.method}")
    logger.info(f"Recommendation Request - Origin: {request.headers.get('Origin')}")

    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "error": "No image selected"}), 400
    
    # Save file temporarily
    upload_dir = os.path.join(os.getcwd(), 'temp_uploads')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    filename = werkzeug.utils.secure_filename(file.filename)
    temp_path = os.path.join(upload_dir, filename)
    file.save(temp_path)
    
    try:
        # Get top 5 recommendations
        results = recommender.recommend(temp_path, k=5)
        
        formatted_recommendations = []
        for item in results:
            formatted_recommendations.append({
                "id": str(item.get("_id")),
                "name": item.get("name"),
                "category": item.get("category"),
                "brand": item.get("brand"),
                "price": item.get("price"),
                "similarity": round(float(item.get("similarity_score", 0)), 2),
                "imageUrl": item.get("imageUrl") or item.get("image_url")
            })
            
        return jsonify({
            "success": True,
            "recommendations": formatted_recommendations
        }), 200
    except Exception as e:
        logger.error(f"Error in recommendation engine: {str(e)}", exc_info=True)
        return jsonify({
            "success": False, 
            "error": "Detailed error message: " + str(e),
            "details": "The recommendation engine encountered an internal server error."
        }), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@recommendations_bp.route('/similar', methods=['POST'])
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
        
        # Bonus: Add category, colors, and tags (heuristic/mock for now)
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

@recommendations_bp.route('/recommendations', methods=['GET'])
def list_recommendations():
    # This could return history or general recommendations
    return jsonify({"message": "Use POST /api/recommend with an image for personalized picks"}), 200
