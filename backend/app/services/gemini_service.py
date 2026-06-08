from google import genai
from google.genai import types
import logging
import time
import os
from app.core.config import Config

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self._client = None
        self._initialized = False
        self._active_model_name = None
        self._init_error = None
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
        if self._initialized and self._client:
            return True
        
        api_key = Config.GEMINI_API_KEY
        logger.info(f"Initializing GeminiService (New SDK: google-genai). API Key present: {bool(api_key)}")
        
        if not api_key:
            self._init_error = "GEMINI_API_KEY is missing from environment variables."
            logger.error(f"CRITICAL: {self._init_error}")
            return False
            
        try:
            self._client = genai.Client(api_key=api_key)
            
            # Diagnostic: List and log available models
            available_models = []
            try:
                for m in self._client.models.list():
                    available_models.append({
                        "name": m.name,
                        "methods": m.supported_generation_methods
                    })
                model_names = [m['name'] for m in available_models]
                logger.info(f"Available Gemini Models: {', '.join(model_names)}")
            except Exception as e:
                logger.warning(f"Could not list models: {str(e)}")

            # Model selection: GEMINI_MODEL or prioritized candidates
            # Using gemini-2.5-flash as the new primary per user instruction
            candidate_models = [
                Config.GEMINI_MODEL,
                'gemini-2.5-flash',
                'gemini-2.5-pro',
                'gemini-2.0-flash',
                'gemini-1.5-flash'
            ]
            
            # Remove None and models/ prefix
            candidate_models = [m.replace('models/', '') for m in candidate_models if m]
            
            selected_model = None
            for model_name in candidate_models:
                try:
                    logger.info(f"Verifying model: {model_name}...")
                    # New SDK: try a simple test call to verify availability
                    # We use generate_content with a very small prompt
                    self._client.models.generate_content(
                        model=model_name,
                        contents="ping",
                        config=types.GenerateContentConfig(max_output_tokens=1)
                    )
                    selected_model = model_name
                    logger.info(f"Model verified and selected: {selected_model}")
                    break
                except Exception as e:
                    logger.warning(f"Model {model_name} unavailable: {str(e)}")
            
            if not selected_model:
                # Absolute fallback: try to find any model with generateContent
                for m in available_models:
                    if 'generateContent' in m['methods']:
                        selected_model = m['name'].replace('models/', '')
                        logger.info(f"Fallback to discovered model: {selected_model}")
                        break

            if not selected_model:
                self._init_error = "No supported Gemini models found."
                logger.error(self._init_error)
                return False

            self._active_model_name = selected_model
            self._initialized = True
            logger.info(f"GeminiService fully initialized with {self._active_model_name}")
            return True
            
        except Exception as e:
            self._init_error = f"Gemini SDK initialization failed: {str(e)}"
            logger.error(self._init_error, exc_info=True)
            return False

    def list_available_models(self):
        """Diagnostic helper."""
        if not self._client and not self._initialize():
            return []
        try:
            models = []
            for m in self._client.models.list():
                models.append({
                    "name": m.name,
                    "methods": m.supported_generation_methods,
                    "display_name": m.display_name
                })
            return models
        except Exception as e:
            logger.error(f"Error listing Gemini models: {str(e)}")
            return []

    def generate_response(self, message, history=None):
        if not self._initialize():
            return {
                "success": False,
                "error": f"Gemini configuration error: {self._init_error}"
            }
            
        if not message:
            return {
                "success": False,
                "error": "Empty message provided."
            }

        try:
            # Format history for new SDK
            # New SDK format for history is a list of Content objects
            contents = []
            if history:
                for msg in history:
                    role = "user" if msg.get("role") == "user" else "model"
                    contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.get("content", ""))]))
            
            # Add the new message
            contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

            logger.info(f"Generating content with model {self._active_model_name}")
            
            # Generate response
            response = self._client.models.generate_content(
                model=self._active_model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=self._system_instruction,
                    temperature=0.7,
                    max_output_tokens=1000
                )
            )

            if response and response.text:
                return {
                    "success": True,
                    "response": response.text
                }
            else:
                return {
                    "success": False,
                    "error": "Gemini returned an empty response."
                }

        except Exception as e:
            err_msg = str(e)
            logger.error(f"Gemini generation error ({self._active_model_name}): {err_msg}", exc_info=True)
            
            # Handle specific errors
            if "404" in err_msg or "not found" in err_msg.lower():
                self._initialized = False # Force re-init to pick new model next time
            
            return {
                "success": False,
                "error": f"Gemini API error: {err_msg}"
            }

    def get_status(self):
        return {
            "status": "healthy" if self._initialized else "error",
            "gemini_configured": bool(Config.GEMINI_API_KEY),
            "client_initialized": self._initialized,
            "active_model": self._active_model_name,
            "sdk": "google-genai",
            "last_error": self._init_error if not self._initialized else None
        }

# Singleton instance
gemini_service = GeminiService()
