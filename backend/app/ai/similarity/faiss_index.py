import faiss
import numpy as np
import os

class FAISSIndex:
    def __init__(self, dimension=3024):
        self.dimension = dimension
        # L2 distance index (can be used for inner product if normalized)
        self.index = faiss.IndexFlatIP(dimension) 
        self.item_ids = []

    def add_items(self, embeddings, ids):
        if not embeddings:
            return
        embeddings_np = np.array(embeddings).astype('float32')
        self.index.add(embeddings_np)
        self.item_ids.extend(ids)

    def search(self, query_embedding, k=10):
        if self.index.ntotal == 0:
            return [], []
        
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
        faiss.write_index(self.index, path)

    def load(self, path):
        self.index = faiss.read_index(path)
