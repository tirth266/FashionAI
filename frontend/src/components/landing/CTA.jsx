import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-600/5 -z-10"></div>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-pink-700 p-12 md:p-20 rounded-[40px] shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <div className="w-64 h-64 border-[32px] border-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to elevate your style?</h2>
          <p className="text-purple-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join 50,000+ fashionistas who are already using StylePulse AI to perfect their look.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={ROUTES.DASHBOARD} className="w-full sm:w-auto px-10 py-4 bg-white text-purple-600 font-bold rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
              Get Styled Now
            </Link>
            <Link to={ROUTES.DASHBOARD} className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all">
              Login to Account
            </Link>
          </div>
          <p className="mt-8 text-sm text-purple-200">No credit card required. Start your style journey today.</p>
        </motion.div>
      </div>
    </section>
  );
};
