import google.generativeai as genai
import logging
from app.core.config import Config

logger = logging.getLogger(__name__)

class FashionChatAgent:
    def __init__(self):
        self._model = None
        self._initialized = False
        self._init_error = None
        self.initialize()

    def initialize(self):
        try:
            if Config.GEMINI_API_KEY:
                logger.info("Initializing Gemini API with GEMINI_API_KEY...")
                genai.configure(api_key=Config.GEMINI_API_KEY)
                # Use gemini-1.5-flash as default, it's fast and reliable
                self._model = genai.GenerativeModel('gemini-1.5-flash')
                self._initialized = True
                self._init_error = None
                logger.info("Gemini API initialized successfully with model: gemini-1.5-flash")
            else:
                self._initialized = False
                self._init_error = "GEMINI_API_KEY is missing from environment"
                logger.error("Gemini API Initialization Failed: GEMINI_API_KEY not found in Config")
        except Exception as e:
            self._initialized = False
            self._init_error = str(e)
            logger.error(f"Gemini API Initialization Failed: {str(e)}", exc_info=True)

    def process(self, message):
        # Lazy re-initialization if not initialized
        if not self._initialized:
            logger.info("Attempting lazy re-initialization of Gemini API...")
            self.initialize()

        if not self._initialized or not self._model:
            error_msg = self._init_error or "Gemini API key not configured."
            logger.error(f"Chat request failed: {error_msg}")
            return {
                "error": "Configuration Error",
                "response": f"Gemini API is not properly configured: {error_msg}. Please check your GEMINI_API_KEY."
            }
        
        try:
            logger.info(f"Processing chat message: {message[:50]}...")
            prompt = f"""
            You are a professional AI Fashion Stylist for 'StylePulse'. 
            Your goal is to provide creative, professional, and helpful fashion advice.
            User: {message}
            AI Stylist:"""
            
            response = self._model.generate_content(prompt)
            if not response or not response.text:
                logger.error("Gemini API returned an empty response")
                return {"response": "I'm sorry, I couldn't generate a response. Please try again later."}
                
            return {"response": response.text}
        except Exception as e:
            logger.error(f"Error interacting with Gemini: {str(e)}", exc_info=True)
            return {"response": f"Error interacting with Gemini: {str(e)}"}

    @property
    def status(self):
        return {
            "initialized": self._initialized,
            "key_present": bool(Config.GEMINI_API_KEY),
            "model": "gemini-1.5-flash" if self._initialized else None,
            "error": self._init_error
        }
