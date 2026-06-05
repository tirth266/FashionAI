import google.generativeai as genai
from app.core.config import Config

class FashionChatAgent:
    def __init__(self):
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def process(self, message):
        if not self.model:
            return {"response": "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."}
        
        try:
            prompt = f"""
            You are a professional AI Fashion Stylist for 'StylePulse'. 
            Your goal is to provide creative, professional, and helpful fashion advice.
            User: {message}
            AI Stylist:"""
            
            response = self.model.generate_content(prompt)
            return {"response": response.text}
        except Exception as e:
            return {"response": f"Error interacting with Gemini: {str(e)}"}
