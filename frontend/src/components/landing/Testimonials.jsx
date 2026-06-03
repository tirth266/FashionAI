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
    <section className="py-24 bg-darker/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Fashionistas</h2>
          <p className="text-gray-400">Join a global community of style enthusiasts elevating their look with StylePulse AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-dark p-8 rounded-2xl border border-gray-800"
            >
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-purple-500 fill-purple-500" />)}
              </div>
              <p className="text-gray-300 italic mb-8 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs">
                    {r.avatar}
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
