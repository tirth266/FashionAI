from flask import Blueprint, jsonify, request
from app.agents.fashion_chat_agent import FashionChatAgent

chat_bp = Blueprint('chat_bp', __name__)
chat_agent = FashionChatAgent()

@chat_bp.route('/', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
        
    result = chat_agent.process(message)
    return jsonify(result), 200
