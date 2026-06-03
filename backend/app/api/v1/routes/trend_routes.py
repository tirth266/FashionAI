from flask import Blueprint, jsonify

trend_bp = Blueprint('trend_bp', __name__)

@trend_bp.route('/', methods=['GET'])
def get_trends():
    return jsonify({"message": "Get latest fashion trends"}), 200
