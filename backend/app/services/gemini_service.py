import google.generativeai as genai
import logging
import time
import os
from app.core.config import Config

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self._model = None
        self._initialized = False
        self._active_model_name = None
        self._sdk_version = getattr(genai, "__version__", "unknown")
        self._system_instruction = """
You are StylePulse AI, an expert fashion stylist.

Your expertise includes:
- Men's fashion
- Women's fashion
- Streetwear
- Formalwear
- Business attire
- Seasonal trends
- Color matching
- Body type recommendations
- Occasion styling
- Footwear matching
- Accessories
- Sustainable fashion

Always:
- Give practical recommendations.
- Explain why items work together.
- Suggest color combinations.
- Recommend complete outfits.
- Be concise but helpful.
- Never mention being an AI model.
- Respond in a professional stylist tone.
"""

    def _initialize(self):
        if self._initialized:
            return True
        
        api_key = Config.GEMINI_API_KEY
        logger.info(f"Initializing GeminiService (SDK: {self._sdk_version}). API Key present: {bool(api_key)}")
        
        if not api_key:
            logger.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.")
            return False
            
        try:
            genai.configure(api_key=api_key)
            
            # 3 & 4. Implement Model Fallback Logic
            candidate_models = [
                'gemini-1.5-pro',
                'gemini-1.5-flash',
                'gemini-2.0-flash-exp',
                'gemini-pro'
            ]
            
            last_error = None
            for model_name in candidate_models:
                try:
                    logger.info(f"Attempting to initialize model: {model_name}...")
                    model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=self._system_instruction
                    )
                    # Verify model by doing a dummy call or just setting it if we trust the name
                    # We'll set it and let the first call verify, or try a tiny prompt
                    self._model = model
                    self._active_model_name = model_name
                    self._initialized = True
                    logger.info(f"GeminiService initialized successfully using model: {model_name}")
                    return True
                except Exception as e:
                    logger.warning(f"Failed to initialize model {model_name}: {str(e)}")
                    last_error = str(e)
            
            self._init_error = last_error or "No supported models found"
            logger.error(f"Failed to initialize any Gemini model: {self._init_error}")
            return False
            
        except Exception as e:
            self._init_error = str(e)
            logger.error(f"Gemini API configuration error: {self._init_error}", exc_info=True)
            return False

    def generate_response(self, message, history=None):
        if not self._initialize():
            error_reason = "API Key missing" if not Config.GEMINI_API_KEY else getattr(self, '_init_error', 'Model configuration failed')
            return {
                "success": False,
                "error": f"Gemini model configuration error. Reason: {error_reason}"
            }
            
        if not message:
            return {
                "success": False,
                "error": "Empty message provided."
            }

        try:
            # Format history for Gemini SDK if provided
            chat_history = []
            if history:
                for msg in history:
                    role = "user" if msg.get("role") == "user" else "model"
                    chat_history.append({"role": role, "parts": [msg.get("content", "")]})

            chat_session = self._model.start_chat(history=chat_history)
            
            logger.info(f"Sending message to Gemini model {self._active_model_name}")
            
            # Simple retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = chat_session.send_message(message, request_options={"timeout": 30})
                    
                    if response and response.text:
                        return {
                            "success": True,
                            "response": response.text
                        }
                    else:
                        logger.warning(f"Gemini returned empty response on attempt {attempt + 1}")
                except Exception as e:
                    logger.warning(f"Gemini API attempt {attempt + 1} failed: {str(e)}")
                    if attempt == max_retries - 1:
                        raise e
                    time.sleep(1) # Wait before retry

            return {
                "success": False,
                "error": "Failed to get a valid response from Gemini after retries."
            }

        except Exception as e:
            logger.error(f"Error in GeminiService.generate_response ({self._active_model_name}): {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": f"Gemini API error: {str(e)}"
            }

    def get_status(self):
        return {
            "status": "healthy" if self._initialized else "error",
            "gemini_configured": bool(Config.GEMINI_API_KEY),
            "client_initialized": self._initialized,
            "active_model": self._active_model_name,
            "sdk_version": self._sdk_version,
            "last_error": getattr(self, '_init_error', None) if not self._initialized else None
        }

# Singleton instance
gemini_service = GeminiService()
