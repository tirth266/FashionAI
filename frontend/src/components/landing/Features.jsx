import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Layers, MessageSquare, TrendingUp, Palette, Briefcase } from 'lucide-react';

const features = [
  {
    title: 'Personalized Recommendations',
    desc: 'AI-powered picks based on your body type, color palette, and style preferences.',
    icon: UserCheck,
    color: 'text-violet-600 dark:text-violet-400'
  },
  {
    title: 'Virtual Outfit Builder',
    desc: 'Mix and match items from your wardrobe and top brands to create the perfect look.',
    icon: Layers,
    color: 'text-pink-500 dark:text-pink-400'
  },
  {
    title: 'AI Style Assistant',
    desc: 'Get real-time fashion advice and outfit suggestions from our advanced chatbot.',
    icon: MessageSquare,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Trend Detection',
    desc: 'Stay ahead of the curve with deep insights into upcoming fashion movements and styles.',
    icon: TrendingUp,
    color: 'text-emerald-500 dark:text-emerald-400'
  },
  {
    title: 'Color Matching',
    desc: 'Never clash again with our advanced color coordination engine that finds the perfect palette.',
    icon: Palette,
    color: 'text-rose-500 dark:text-rose-400'
  },
  {
    title: 'Wardrobe Management',
    desc: 'Digitize your closet and plan your outfits for any occasion with ease.',
    icon: Briefcase,
    color: 'text-indigo-600 dark:text-indigo-400'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-page-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-4">Elevate Your Style with AI</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Everything you need to look your best, powered by artificial intelligence and the latest fashion data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-light dark:border-dark shadow-soft hover:shadow-xl transition-all group"
            >
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit mb-6 group-hover:bg-brand/10 transition-colors`}>
                <f.icon className={f.color} size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
