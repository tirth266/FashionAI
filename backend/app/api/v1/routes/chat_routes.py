from flask import Blueprint, jsonify, request
from app.services.gemini_service import gemini_service
import logging

logger = logging.getLogger(__name__)
chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
def chat():
    if request.method == "OPTIONS":
        return "", 200
        
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
            # 7 & 9. Prevent generic 503 errors and return exact failure reason
            error_msg = result.get("error", "Unknown error")
            status_code = 500 # Default to 500 for API failures
            
            if "not configured" in error_msg.lower() or "initialization failed" in error_msg.lower():
                status_code = 503 # Service Unavailable (Config issue)
            elif "not found" in error_msg.lower() or "404" in error_msg:
                status_code = 404 # Not Found (Model issue)
                
            return jsonify({
                "success": False,
                "error": error_msg,
                "details": "The AI Stylist is currently experiencing technical difficulties."
            }), status_code

    except Exception as e:
        logger.error(f"Global exception in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "success": False, 
            "error": f"Internal Server Error: {str(e)}"
        }), 500

@chat_bp.route('/health', methods=['GET'])
def health():
    status = gemini_service.get_status()
    # 6. Add endpoint: GET /api/chat/health Response: {"gemini_configured": true, "model": "<active_model>"}
    return jsonify({
        "status": status["status"],
        "gemini_configured": status["gemini_configured"],
        "client_initialized": status["client_initialized"],
        "model": status.get("active_model"),
        "sdk_version": status.get("sdk_version"),
        "last_error": status.get("last_error")
    }), 200 if status["status"] == "healthy" else 503

@chat_bp.route('/models', methods=['GET'])
def list_models():
    """2. Add diagnostic endpoint: GET /api/chat/models"""
    try:
        models = gemini_service.list_available_models()
        return jsonify({
            "success": True,
            "total": len(models),
            "models": models
        }), 200
    except Exception as e:
        logger.error(f"Error in list_models endpoint: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
