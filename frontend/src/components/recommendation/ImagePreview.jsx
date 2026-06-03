import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const ImagePreview = ({ image, onRemove }) => {
  const imageUrl = URL.createObjectURL(image);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative max-w-sm mx-auto"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Remove image"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-xs uppercase tracking-widest font-semibold opacity-80 mb-1">Current Style</p>
          <p className="text-lg font-medium">{image.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePreview;
