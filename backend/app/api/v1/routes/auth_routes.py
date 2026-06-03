from flask import Blueprint, jsonify, request

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    return jsonify({"message": "Login endpoint"}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify({"message": "Register endpoint"}), 201
