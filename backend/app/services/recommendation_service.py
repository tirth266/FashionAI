from app.ai.embeddings.feature_extractor import FeatureExtractor
from app.ai.similarity.faiss_index import FAISSIndex
from app.models.fashion_item_model import FashionItem
from bson import ObjectId

class RecommendationService:
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.faiss_index = FAISSIndex()
        self._initialize_index()

    def _initialize_index(self):
        items = FashionItem.get_all()
        embeddings = [item["embedding"] for item in items if "embedding" in item]
        ids = [str(item["_id"]) for item in items if "embedding" in item]
        self.faiss_index.add_items(embeddings, ids)

    def recommend(self, image_path, k=10, filters=None):
        # 1. Extract embedding
        query_embedding = self.feature_extractor.extract(image_path)
        
        # 2. Search similarity
        raw_results = self.faiss_index.search(query_embedding, k=k*2) # Get more to filter
        
        # 3. Fetch item details and filter
        recommendations = []
        for res in raw_results:
            item = FashionItem.find_by_id(res["id"])
            if item:
                # Apply filters (Category, Price, etc.)
                if filters:
                    match = True
                    for key, value in filters.items():
                        if item.get(key) != value:
                            match = False
                            break
                    if not match:
                        continue
                
                item["_id"] = str(item["_id"])
                item["similarity_score"] = res["score"]
                recommendations.append(item)
                
            if len(recommendations) >= k:
                break
                
        return recommendations
