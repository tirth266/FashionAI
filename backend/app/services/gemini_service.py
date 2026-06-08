import google.generativeai as genai
import logging
import time
from app.core.config import Config

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self._model = None
        self._initialized = False
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
        if not api_key:
            logger.error("GEMINI_API_KEY is not configured")
            return False
            
        try:
            genai.configure(api_key=api_key)
            self._model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=self._system_instruction
            )
            self._initialized = True
            logger.info("GeminiService initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize GeminiService: {str(e)}")
            return False

    def generate_response(self, message, history=None):
        if not self._initialize():
            return {
                "success": False,
                "error": "Gemini API is not configured properly."
            }
            
        if not message:
            return {
                "success": False,
                "error": "Empty message provided."
            }

        try:
            # Format history for Gemini SDK if provided
            # Gemini history format: [{"role": "user", "parts": ["..."]}, {"role": "model", "parts": ["..."]}]
            chat_history = []
            if history:
                for msg in history:
                    role = "user" if msg.get("role") == "user" else "model"
                    chat_history.append({"role": role, "parts": [msg.get("content", "")]})

            chat_session = self._model.start_chat(history=chat_history)
            
            logger.info(f"Sending message to Gemini: {message[:50]}...")
            
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
                "error": "Failed to get a valid response from Gemini."
            }

        except Exception as e:
            logger.error(f"Error in GeminiService.generate_response: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": f"An error occurred while communicating with the AI stylist: {str(e)}"
            }

    def get_status(self):
        return {
            "status": "healthy" if self._initialized or Config.GEMINI_API_KEY else "error",
            "gemini": "connected" if self._initialized else "not_initialized",
            "api_key_configured": bool(Config.GEMINI_API_KEY)
        }

# Singleton instance
gemini_service = GeminiService()
