import React, { useState } from 'react';
import { uploadFashionImage } from '../services/recommendationService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import UploadImage from '../components/recommendation/UploadImage';
import ImagePreview from '../components/recommendation/ImagePreview';
import RecommendationGrid from '../components/recommendation/RecommendationGrid';
import LoadingState from '../components/recommendation/LoadingState';

export const RecommendPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setError(null);
    setRecommendations([]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setRecommendations([]);
    setError(null);
  };

  const getRecommendations = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const data = await uploadFashionImage(selectedImage);
      if (data.success) {
        setRecommendations(data.recommendations || []);
      } else {
        setError(data.error || 'Failed to get recommendations.');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.error || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="bg-black p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500">AI Powered Analysis</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Find Your Next Favorite <br /> <span className="text-gray-400">Style Match</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            Upload a photo of any fashion item, and our AI will search thousands of products to find your perfect matches.
          </motion.p>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!selectedImage ? (
              <UploadImage onImageSelect={handleImageSelect} key="upload" />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
                key="preview"
              >
                <ImagePreview image={selectedImage} onRemove={handleRemoveImage} />
                
                {!loading && recommendations.length === 0 && !error && (
                  <div className="flex justify-center">
                    <button
                      onClick={getRecommendations}
                      className="group relative inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold overflow-hidden transition-all hover:pr-12 active:scale-95"
                    >
                      <span>Analyze My Style</span>
                      <Sparkles className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {loading && <LoadingState />}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-900"
            >
              <AlertCircle className="shrink-0" size={24} />
              <div className="flex-1">
                <p className="font-medium text-sm">{error}</p>
                <button 
                  onClick={getRecommendations}
                  className="mt-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <RefreshCw size={12} /> Try Again
                </button>
              </div>
            </motion.div>
          )}

          {!loading && recommendations.length > 0 && (
            <RecommendationGrid recommendations={recommendations} />
          )}
        </main>
      </div>
    </div>
  );
};
