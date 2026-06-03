import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="mt-16">
      <div className="flex flex-col items-center mb-12">
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-full mb-3"></div>
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-4">
            <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 w-2/3 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-5 w-full bg-gray-100 animate-pulse rounded"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 w-16 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-500 text-sm font-medium animate-pulse">
          AI is analyzing your style and searching for matches...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
