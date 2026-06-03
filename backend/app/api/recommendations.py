from flask import Blueprint, request, jsonify
from app.services.recommendation_service import RecommendationService
import os
import werkzeug

recommendations_bp = Blueprint('recommendations', __name__)
# Initialize service (this will load the model and index fashion items)
recommender = RecommendationService()

@recommendations_bp.route('/recommend', methods=['POST'])
def get_recommendations():
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
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@recommendations_bp.route('/recommendations', methods=['GET'])
def list_recommendations():
    # This could return history or general recommendations
    return jsonify({"message": "Use POST /api/recommend with an image for personalized picks"}), 200
