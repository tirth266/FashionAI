import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-black text-white overflow-hidden">
      {/* Left Side: High-Fashion Imagery & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AI FASHION
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Elevate your style with the power of artificial intelligence. Your personal stylist is just a login away.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
          </div>
          
          <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

