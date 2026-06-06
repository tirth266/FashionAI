import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sophie Laurent',
    role: 'Fashion Blogger',
    text: 'StylePulse AI has completely transformed how I plan my content. The trend detection is spot on every single time!',
    avatar: 'SL'
  },
  {
    name: 'James Wilson',
    role: 'Creative Director',
    text: 'Finally, an AI that understands personal style. The virtual outfit builder saves me so much time in the mornings.',
    avatar: 'JW'
  },
  {
    name: 'Amara Okafor',
    role: 'Personal Stylist',
    text: 'I use StylePulse to give my clients better recommendations. The color matching engine is a game changer for my business.',
    avatar: 'AO'
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white dark:bg-page-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-4">Loved by Fashionistas</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Join a global community of style enthusiasts elevating their look with StylePulse AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-light dark:border-dark shadow-soft transition-all duration-300"
            >
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-violet-500 fill-violet-500" />)}
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed font-medium">"{r.text}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                    {r.avatar}
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-950 dark:text-white">{r.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
