from flask import Blueprint, jsonify

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    return jsonify({"message": "User profile data"}), 200

@user_bp.route('/preferences', methods=['GET', 'PUT'])
def preferences():
    return jsonify({"message": "User fashion preferences"}), 200
