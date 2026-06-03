import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shirt, User, Footprints, Briefcase, Dumbbell, Watch } from 'lucide-react';

const categories = [
  { title: "Men's Fashion", desc: 'Sophisticated styles for the modern man.', icon: User, color: 'text-blue-500' },
  { title: "Women's Fashion", desc: 'Elegant and trendy outfits for every occasion.', icon: User, color: 'text-pink-500' },
  { title: 'Casual Wear', desc: 'Comfortable yet stylish daily essentials.', icon: Shirt, color: 'text-purple-500' },
  { title: 'Formal Wear', desc: 'Professional attire and black-tie excellence.', icon: Briefcase, color: 'text-indigo-500' },
  { title: 'Sportswear', desc: 'Performance-driven apparel for active lifestyles.', icon: Dumbbell, color: 'text-green-500' },
  { title: 'Accessories', desc: 'The perfect finishing touches for any look.', icon: Watch, color: 'text-yellow-500' }
];

export const Categories = () => {
  return (
    <section id="categories" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Curated styles for <span className="text-purple-500">every lifestyle.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map((item, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                  <div className={`mt-1 bg-gray-700/50 p-2 rounded-lg`}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-800 to-dark p-1 rounded-[32px] border border-gray-700 shadow-2xl overflow-hidden">
                <div className="bg-darker p-8 rounded-[31px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Today's Top Pick</p>
                            <h3 className="text-3xl font-bold text-white mt-1">Linen Summer Set</h3>
                        </div>
                        <div className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">
                            99% Match
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-600/20 rounded-lg"><Shirt className="text-purple-500" size={18} /></div>
                                <span className="text-sm font-medium">Style: Minimalist Chic</span>
                            </div>
                            <span className="text-xs text-purple-400 font-bold">Trending</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-pink-600/20 rounded-lg"><Watch className="text-pink-500" size={18} /></div>
                                <span className="text-sm font-medium">Accessorized with: Silver Watch</span>
                            </div>
                            <span className="text-sm text-green-500 font-bold">+ Perfect</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-600/5 rounded-2xl border border-purple-500/10">
                            <Shirt className="text-purple-500 mb-2" size={24} />
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Items</p>
                            <p className="text-lg font-bold text-white">3 Pieces</p>
                        </div>
                        <div className="p-4 bg-pink-600/5 rounded-2xl border border-pink-500/10">
                            <CheckCircle2 className="text-pink-500 mb-2" size={24} />
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Confidence Score</p>
                            <p className="text-lg font-bold text-white">High (98%)</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Background Blur Decor */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/20 blur-[100px] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
