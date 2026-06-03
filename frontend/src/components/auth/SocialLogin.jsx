import React from 'react';
import { motion } from 'framer-motion';

export const SocialLogin = () => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex justify-center py-2.5 px-4 border border-white/10 rounded-xl bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
        >
          <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          Google
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex justify-center py-2.5 px-4 border border-white/10 rounded-xl bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
        >
          <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" />
          Apple
        </motion.button>
      </div>
    </div>
  );
};

