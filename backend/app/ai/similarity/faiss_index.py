try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    import logging
    logging.getLogger(__name__).warning("FAISS not found. Vector search will be disabled.")
    FAISS_AVAILABLE = False
import numpy as np
import os

class FAISSIndex:
    def __init__(self, dimension=440):
        self.dimension = dimension
        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatIP(dimension) 
        else:
            self.index = None
        self.item_ids = []

    def add_items(self, embeddings, ids):
        if not FAISS_AVAILABLE or not embeddings:
            return
        embeddings_np = np.array(embeddings).astype('float32')
        self.index.add(embeddings_np)
        self.item_ids.extend(ids)

    def search(self, query_embedding, k=10):
        if not FAISS_AVAILABLE or self.index is None or self.index.ntotal == 0:
            return []
        
        query_np = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1:
                results.append({
                    "id": self.item_ids[idx],
                    "score": float(distances[0][i])
                })
        return results

    def save(self, path):
        if FAISS_AVAILABLE and self.index:
            faiss.write_index(self.index, path)

    def load(self, path):
        if FAISS_AVAILABLE:
            self.index = faiss.read_index(path)

