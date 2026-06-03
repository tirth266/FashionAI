import React from 'react';
import RecommendationCard from './RecommendationCard';
import { motion } from 'framer-motion';

const RecommendationGrid = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center mb-12"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2">Curated for you</span>
        <h2 className="text-3xl font-bold text-gray-900">AI Recommendations</h2>
        <div className="h-1 w-12 bg-black mt-4 rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {recommendations.slice(0, 5).map((item, index) => (
          <RecommendationCard key={item.id || index} product={item} index={index} />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 text-sm">
          Showing our top matches based on your visual style analysis.
        </p>
      </motion.div>
    </div>
  );
};

export default RecommendationGrid;
