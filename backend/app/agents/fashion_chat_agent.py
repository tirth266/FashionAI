from google import genai
from google.genai import types
import logging
from app.core.config import Config

logger = logging.getLogger(__name__)

class FashionChatAgent:
    def __init__(self):
        self._client = None
        self._initialized = False
        self._init_error = None
        self._active_model = None
        self.initialize()

    def initialize(self):
        try:
            if Config.GEMINI_API_KEY:
                logger.info("Initializing FashionChatAgent with new google-genai SDK...")
                self._client = genai.Client(api_key=Config.GEMINI_API_KEY)
                
                # Use primary models from Config or defaults
                candidate_models = [Config.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-1.5-flash']
                candidate_models = [m for m in candidate_models if m]
                
                selected = None
                for model_name in candidate_models:
                    try:
                        # Test call
                        self._client.models.generate_content(
                            model=model_name,
                            contents="ping",
                            config=types.GenerateContentConfig(max_output_tokens=1)
                        )
                        selected = model_name
                        break
                    except:
                        continue
                
                if not selected:
                    # Discover
                    for m in self._client.models.list():
                        if 'generateContent' in m.supported_generation_methods:
                            selected = m.name
                            break
                
                if selected:
                    self._active_model = selected
                    self._initialized = True
                    self._init_error = None
                    logger.info(f"FashionChatAgent initialized with model: {self._active_model}")
                else:
                    self._initialized = False
                    self._init_error = "No supported models found"
            else:
                self._initialized = False
                self._init_error = "GEMINI_API_KEY is missing"
        except Exception as e:
            self._initialized = False
            self._init_error = str(e)
            logger.error(f"FashionChatAgent Initialization Failed: {str(e)}", exc_info=True)

    def process(self, message):
        if not self._initialized:
            self.initialize()

        if not self._initialized or not self._client:
            return {"response": f"Error: {self._init_error}"}
        
        try:
            response = self._client.models.generate_content(
                model=self._active_model,
                contents=f"User: {message}\nAI Stylist:",
                config=types.GenerateContentConfig(
                    system_instruction="You are StylePulse AI, a professional fashion stylist.",
                    max_output_tokens=500
                )
            )
            return {"response": response.text if response else "Empty response"}
        except Exception as e:
            logger.error(f"Agent Chat Error ({self._active_model}): {str(e)}")
            return {"response": f"Error: {str(e)}"}

    @property
    def status(self):
        return {
            "initialized": self._initialized,
            "key_present": bool(Config.GEMINI_API_KEY),
            "model": self._active_model,
            "error": self._init_error
        }
