import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Shirt, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles size={14} />
            <span>AI-Powered Fashion Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8"
          >
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Style with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 px-4"
          >
            Discover personalized fashion recommendations, build stunning outfits, and stay ahead of trends with our advanced AI stylist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to={ROUTES.DASHBOARD} className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Get Styled Now</span>
              <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-gray-800/50 hover:bg-gray-800 text-white font-bold rounded-full border border-gray-700 transition-all flex items-center justify-center space-x-2">
              <Play size={18} fill="currentColor" />
              <span>Explore Trends</span>
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-dark/50 backdrop-blur-sm p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center space-x-2 mb-4 border-b border-gray-800 pb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <div className="flex-1"></div>
                <div className="w-32 h-2 bg-gray-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-12 gap-4 h-64 md:h-96">
                <div className="col-span-3 space-y-3">
                    <div className="h-full bg-gray-800/30 rounded-lg p-3 space-y-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-full bg-gray-700/50 rounded-full"></div>)}
                    </div>
                </div>
                <div className="col-span-9 space-y-4">
                    <div className="h-2/3 bg-purple-600/5 rounded-lg border border-purple-500/10 flex items-center justify-center">
                        <Shirt className="text-purple-500/20" size={120} />
                    </div>
                    <div className="h-1/3 grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="bg-gray-800/30 rounded-lg"></div>)}
                    </div>
                </div>
            </div>
          </div>
          {/* Floating Stats */}
          <div className="absolute -top-10 -right-5 md:right-10 hidden sm:block">
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-dark border border-purple-500/30 p-4 rounded-xl shadow-xl"
            >
                <p className="text-xs text-gray-400">Style Match</p>
                <p className="text-lg font-bold text-purple-500">98% Match</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-12">
            {[
                { label: 'Outfits Generated', value: '1.2M+' },
                { label: 'Styles Analyzed', value: '500k+' },
                { label: 'Satisfied Fashionistas', value: '50k+' },
                { label: 'Trend Accuracy', value: '95%' }
            ].map((stat, i) => (
                <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
