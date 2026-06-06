import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for discovering your personal style.',
    features: ['3 AI Recommendations / day', 'Basic Outfit Builder', 'Limited Trend Insights', 'Standard Support'],
    not: ['Unlimited Outfit Generation', 'Advanced Trend Analysis', 'Priority Support'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Style Pro',
    price: '$29',
    desc: 'The complete toolkit for fashion enthusiasts.',
    features: ['Unlimited Outfit Generation', 'Full Trend Analysis', 'AI Style Assistant Access', 'Color Matching Engine', 'Wardrobe Management'],
    not: ['Exclusive Trend Reports'],
    cta: 'Go Pro Now',
    popular: true
  },
  {
    name: 'Fashion Icon',
    price: '$99',
    desc: 'Elite features for the ultimate fashionistas.',
    features: ['Exclusive Trend Reports', 'Dedicated Style Consultant', 'Early Access to New Items', 'Priority Support', 'Personalized Style Model'],
    not: [],
    cta: 'Join the Elite',
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-page-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Choose the plan that fits your style goals. No hidden fees, cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={`relative bg-white dark:bg-card-dark p-8 rounded-3xl border transition-all duration-300 ${p.popular ? 'border-brand shadow-xl scale-105 z-10' : 'border-light dark:border-dark shadow-soft'} flex flex-col`}
            >
              {p.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">{p.name}</h3>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-4xl font-bold text-gray-950 dark:text-white">{p.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-medium">{p.desc}</p>
              
              <div className="space-y-4 mb-10 flex-1">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <Check size={18} className="text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{f}</span>
                  </div>
                ))}
                {p.not.map((f, j) => (
                  <div key={j} className="flex items-center space-x-3 opacity-40">
                    <X size={18} className="text-gray-400 dark:text-gray-600" />
                    <span className="text-sm text-gray-500 dark:text-gray-600 line-through">{f}</span>
                  </div>
                ))}
              </div>

              <Link 
                to={ROUTES.DASHBOARD} 
                className={`w-full py-4 text-center rounded-xl font-bold transition-all duration-300 shadow-md ${p.popular ? 'bg-brand hover:bg-brand-dark text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
