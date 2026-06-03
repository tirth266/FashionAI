class Orchestrator:
    def __init__(self):
        self.agents = {
            "recommendation": "RecommendationAgent",
            "style_analysis": "StyleAnalysisAgent",
            "outfit_generation": "OutfitGenerationAgent",
            "trend_analysis": "TrendAnalysisAgent",
            "color_matching": "ColorMatchingAgent",
            "fashion_chat": "FashionChatAgent"
        }

    def run(self, task, data=None):
        if task in self.agents:
            return f"Orchestrating {task} with {self.agents[task]} using data: {data}"
        return f"Unknown task: {task}"
