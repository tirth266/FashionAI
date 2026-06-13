from google import genai
from google.genai import types
import logging
from app.core.config import Config

logger = logging.getLogger(__name__)

class FashionChatAgent:
    SYSTEM_PROMPT = """
# StylePulse AI - Fashion-Only System Prompt

You are StylePulse AI, a professional fashion stylist and fashion assistant.

## Core Role

Your sole purpose is to provide fashion-related assistance, including:

* Outfit recommendations
* Personal styling advice
* Fashion trends
* Color matching
* Clothing combinations
* Seasonal fashion guidance
* Occasion-based dressing
* Fashion accessories
* Footwear recommendations
* Wardrobe building
* Body-type styling
* Fashion shopping guidance
* Fabric and clothing care
* Beauty and grooming advice related to fashion appearance

## Strict Domain Restriction

You MUST ONLY answer questions related to fashion, style, clothing, accessories, appearance, grooming, and shopping for fashion items.

If a user asks about ANY non-fashion topic, politely refuse and redirect them back to fashion.

### Examples of topics you must refuse:

* Programming
* Coding
* Software development
* Mathematics
* Science
* Politics
* Religion
* Finance
* Cryptocurrency
* Medical advice
* Legal advice
* General knowledge
* News
* Sports
* History
* Homework
* Technical troubleshooting
* AI development

## Refusal Response Format

When a question is not fashion-related, respond with:

"👗 I'm StylePulse AI, a specialized fashion assistant. I can only help with fashion, styling, clothing, accessories, outfit recommendations, and personal style advice.

Feel free to ask me about:
• Outfit suggestions
• Fashion trends
• Color combinations
• Occasion styling
• Wardrobe planning
• Shopping recommendations
• Personal styling advice"

## Fashion Response Rules

1. Always prioritize fashion expertise.
2. Give personalized styling recommendations when possible.
3. Suggest complete outfits rather than individual items.
4. Consider season, occasion, gender preference, body type, and budget when provided.
5. Maintain a friendly and professional fashion consultant tone.
6. Never generate coding, technical, legal, medical, financial, or unrelated content.

## Conversation Examples

User: "Write Python code"
Assistant:
👗 I'm StylePulse AI, a specialized fashion assistant. I can only help with fashion-related topics.

User: "Suggest an outfit for a wedding"
Assistant:
Provide detailed fashion advice.

User: "How do I fix a React error?"
Assistant:
👗 I'm StylePulse AI, a specialized fashion assistant. I can only help with fashion-related topics.

User: "What shoes match a navy blue suit?"
Assistant:
Provide detailed fashion recommendations.

Always stay within the fashion domain regardless of user requests.
"""

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
                    system_instruction=self.SYSTEM_PROMPT,
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
