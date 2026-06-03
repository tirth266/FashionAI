import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI know what suits me?',
    a: 'Our AI analyzes your body type, skin undertone, and style preferences that you provide during onboarding. It then matches this data against thousands of fashion rules and current trends.'
  },
  {
    q: 'Can I upload photos of my own clothes?',
    a: 'Yes! You can take photos of your wardrobe items, and our AI will automatically categorize them and suggest new ways to style them with other pieces.'
  },
  {
    q: 'Is StylePulse AI updated with current trends?',
    a: 'Absolutely. Our engine scans fashion shows, social media, and retail data daily to ensure your recommendations are always ahead of the curve.'
  },
  {
    q: 'Can I buy the recommended items directly?',
    a: 'Yes, we provide direct shopping links to our partner brands for every item we recommend, often with exclusive StylePulse discounts.'
  }
];

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-800">
      <button 
        className="w-full py-6 flex items-center justify-between text-left hover:text-purple-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-white">{q}</span>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Everything you need to know about the platform.</p>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};
