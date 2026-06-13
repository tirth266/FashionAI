try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

import numpy as np
import json
import os
import logging

logger = logging.getLogger(__name__)

class FAISSService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FAISSService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, dimension=3024):
        if self._initialized:
            return
            
        self.dimension = dimension
        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatIP(dimension) # Inner Product for Cosine Similarity (on normalized vectors)
        else:
            self.index = None
            logger.warning("FAISS not found. Vector search is disabled.")
            
        self.product_data = [] # To store metadata mapping to index
        self._initialized = True
        
        # Load initial products if available
        self.build_index()

    def build_index(self):
        """
        Loads products from product_embeddings.json and builds the FAISS index.
        """
        if not FAISS_AVAILABLE:
            return

        data_path = os.path.join(os.getcwd(), 'backend', 'data', 'product_embeddings.json')
        if not os.path.exists(data_path):
            logger.warning(f"Product embeddings file not found at {data_path}")
            return

        try:
            with open(data_path, 'r') as f:
                products = json.load(f)
            
            if not products:
                return

            embeddings = []
            self.product_data = []
            
            for p in products:
                embeddings.append(p['embedding'])
                # Store metadata excluding embedding for response
                metadata = {k: v for k, v in p.items() if k != 'embedding'}
                self.product_data.append(metadata)
            
            embeddings_np = np.array(embeddings).astype('float32')
            
            # Re-initialize index to clear old data
            self.index = faiss.IndexFlatIP(self.dimension)
            self.index.add(embeddings_np)
            
            logger.info(f"FAISS Index built with {len(self.product_data)} products.")
        except Exception as e:
            logger.error(f"Failed to build FAISS index: {str(e)}")

    def search_similar(self, query_embedding, top_k=5):
        """
        Search for top_k similar products.
        """
        if self.index.ntotal == 0:
            return []

        try:
            query_np = np.array([query_embedding]).astype('float32')
            distances, indices = self.index.search(query_np, top_k)
            
            recommendations = []
            for i, idx in enumerate(indices[0]):
                if idx != -1 and idx < len(self.product_data):
                    product = self.product_data[idx].copy()
                    # Cosine similarity is already the distance for normalized vectors with FlatIP
                    product['similarity'] = round(float(distances[0][i]) * 100, 2)
                    recommendations.append(product)
            
            return recommendations
        except Exception as e:
            logger.error(f"FAISS search failed: {str(e)}")
            return []

faiss_service = FAISSService()
