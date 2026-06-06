import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Cpu, ShoppingBag } from 'lucide-react';

const steps = [
  {
    title: 'Create Your Profile',
    desc: 'Input your style preferences, body type, and favorite brands to get started.',
    icon: UserPlus,
    color: 'text-violet-600 dark:text-violet-400'
  },
  {
    title: 'AI Analysis',
    desc: 'Our advanced AI agents analyze thousands of items and latest trends just for you.',
    icon: Cpu,
    color: 'text-pink-500 dark:text-pink-400'
  },
  {
    title: 'Get Recommended',
    desc: 'Receive curated outfit ideas and direct shopping links for your perfect look.',
    icon: ShoppingBag,
    color: 'text-blue-600 dark:text-blue-400'
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-page-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Your journey to a better style in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 text-center group"
            >
              <div className="w-20 h-20 bg-white dark:bg-card-dark border border-light dark:border-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-300 group-hover:scale-110">
                <step.icon className={step.color} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-4">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
