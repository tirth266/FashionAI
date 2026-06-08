from flask import Blueprint, jsonify, request
from app.services.gemini_service import gemini_service
import logging

logger = logging.getLogger(__name__)
chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Invalid JSON or empty request body"}), 400
            
        message = data.get('message')
        history = data.get('history', [])
        
        if not message:
            return jsonify({"success": False, "error": "No message provided"}), 400
            
        logger.info(f"Chat request received: {message[:50]}...")
        
        result = gemini_service.generate_response(message, history)
        
        if result.get("success"):
            return jsonify(result), 200
        else:
            status_code = 500
            if "not configured" in result.get("error", "").lower():
                status_code = 503 # Service Unavailable
            return jsonify(result), status_code

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": "An internal server error occurred"}), 500

@chat_bp.route('/health', methods=['GET'])
def health():
    status = gemini_service.get_status()
    # 8. Add endpoint: GET /api/chat/health Response: {"status":"healthy", "gemini_configured": true}
    return jsonify({
        "status": status["status"],
        "gemini_configured": status["gemini_configured"],
        "client_initialized": status["client_initialized"],
        "last_error": status.get("last_error")
    }), 200 if status["status"] == "healthy" else 503
