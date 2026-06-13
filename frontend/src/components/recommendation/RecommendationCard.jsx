import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendationCard = ({ product, index }) => {
  const similarityPercentage = product.similarity ? product.similarity.toFixed(1) : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 flex flex-col h-full"
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
            Match: {similarityPercentage}%
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-auto">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
            {product.brand}
          </p>
          <h3 className="text-gray-900 font-medium text-base leading-tight group-hover:text-black transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <button className="w-full bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider hover:bg-gray-800 transition-colors">
            View Product
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
