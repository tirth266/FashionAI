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
    if (!selectedImage) {
      console.log('No image selected');
      return;
    }

    console.log('Analyze My Style clicked');
    console.log('Selected image:', selectedImage.name, selectedImage.size, selectedImage.type);

    setLoading(true);
    setError(null);

    try {
      console.log('Calling uploadFashionImage...');
      const data = await uploadFashionImage(selectedImage);
      console.log('API Response received:', data);
      
      if (data.success) {
        console.log('Recommendations found:', data.recommendations?.length || 0);
        console.log('Recommendations data:', data.recommendations);
        setRecommendations(data.recommendations || []);
      } else {
        console.error('API reported failure:', data.error);
        setError(data.error || 'Failed to get recommendations.');
      }
    } catch (err) {
      console.error('Error in getRecommendations catch block:', err);
      setError(err.error || 'Failed to get recommendations. Please try again.');
    } finally {
      console.log('Setting loading to false');
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

          {!loading && recommendations.length === 0 && selectedImage && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto"
            >
              <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any close matches for this item in our current database. 
                Try uploading a different photo or an item with clearer patterns.
              </p>
              <button
                onClick={getRecommendations}
                className="text-black font-bold uppercase tracking-widest text-xs border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all"
              >
                Try Analysis Again
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};
