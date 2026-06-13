import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const LoadingState = () => {
  const steps = [
    "Uploading Image",
    "Extracting Features",
    "Running RegNet Model",
    "Finding Similar Products",
    "Generating Results"
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
        >
          Analyzing Style...
        </motion.div>
        
        <div className="space-y-4 w-full max-w-xs">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
                color: index === currentStep ? '#000' : index < currentStep ? '#666' : '#999'
              }}
              className="flex items-center gap-3 text-sm font-medium"
            >
              {index < currentStep ? (
                <CheckCircle2 className="text-green-500" size={18} />
              ) : index === currentStep ? (
                <Loader2 className="animate-spin text-black" size={18} />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200" />
              )}
              {step}
            </motion.div>
          ))}
        </div>
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
    </div>
  );
};

export default LoadingState;
