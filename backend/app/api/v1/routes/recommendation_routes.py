from flask import Blueprint, jsonify

recommendation_bp = Blueprint('recommendation_bp', __name__)

@recommendation_bp.route('/', methods=['GET'])
def get_recommendations():
    return jsonify({"message": "Get personalized recommendations"}), 200
