from flask import Blueprint, jsonify

outfit_bp = Blueprint('outfit_bp', __name__)

@outfit_bp.route('/', methods=['GET'])
def get_outfits():
    return jsonify({"message": "Get all outfits"}), 200

@outfit_bp.route('/', methods=['POST'])
def create_outfit():
    return jsonify({"message": "Create new outfit"}), 201
