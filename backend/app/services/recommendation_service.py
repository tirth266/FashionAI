from app.ai.embeddings.feature_extractor import FeatureExtractor
from app.ai.similarity.faiss_index import FAISSIndex
from app.models.fashion_item_model import FashionItem
from bson import ObjectId

class RecommendationService:
    def __init__(self):
        self._feature_extractor = None
        self._faiss_index = None
        self._initialized = False

    @property
    def feature_extractor(self):
        if self._feature_extractor is None:
            self._feature_extractor = FeatureExtractor()
        return self._feature_extractor

    @property
    def faiss_index(self):
        if self._faiss_index is None:
            self._faiss_index = FAISSIndex()
            self._initialize_index()
        return self._faiss_index

    def _initialize_index(self):
        if self._initialized:
            return
        
        # Optimize memory by only fetching necessary fields and using a cursor
        items_cursor = FashionItem.collection.find(
            {"embedding": {"$exists": True}}, 
            {"embedding": 1, "_id": 1}
        )
        
        embeddings = []
        ids = []
        for item in items_cursor:
            embeddings.append(item["embedding"])
            ids.append(str(item["_id"]))
        
        if embeddings:
            self._faiss_index.add_items(embeddings, ids)
        self._initialized = True

    def recommend(self, image_path, k=10, filters=None):
        # 1. Extract embedding
        query_embedding = self.feature_extractor.extract(image_path)
        
        # 2. Search similarity (accessing faiss_index property triggers lazy load)
        raw_results = self.faiss_index.search(query_embedding, k=k*2)
        
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
