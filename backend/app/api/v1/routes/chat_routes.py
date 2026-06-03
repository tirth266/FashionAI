from flask import Blueprint, jsonify, request

chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    return jsonify({"response": f"AI Stylist response to: {message}"}), 200
