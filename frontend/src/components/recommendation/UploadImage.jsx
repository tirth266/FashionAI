import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadImage = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm
          ${isDragging 
            ? 'border-black bg-gray-50/80 scale-[1.02]' 
            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        
        <div className="bg-black text-white p-4 rounded-full mb-6">
          <Upload size={24} />
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Upload your style inspiration
        </h3>
        <p className="text-gray-500 text-center mb-6">
          Drag and drop your image here, or click to browse files
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <ImageIcon size={16} />
            <span>Supports JPG, PNG</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>Max 5MB</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadImage;
