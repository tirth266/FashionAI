import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendationCard = ({ product, index }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const similarityPercentage = (product.similarity_score * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-900 hover:bg-black hover:text-white shadow-lg transition-all duration-300">
            <Heart size={18} />
          </button>
          <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-900 hover:bg-black hover:text-white shadow-lg transition-all duration-300">
            <ExternalLink size={18} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {similarityPercentage}% Match
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
              {product.brand} • {product.category}
            </p>
            <h3 className="text-gray-900 font-medium text-lg leading-tight group-hover:text-black transition-colors">
              {product.name}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button className="text-sm font-semibold text-black border-b-2 border-black/10 hover:border-black transition-all pb-0.5">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
