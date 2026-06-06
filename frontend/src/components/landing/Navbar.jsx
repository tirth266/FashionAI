import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-page-dark/80 backdrop-blur-md border-b border-light dark:border-dark py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="text-brand" size={32} />
          <span className="text-2xl font-bold text-gray-950 dark:text-white tracking-tight italic">StylePulse AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">
              {link.name}
            </a>
          ))}
          <div className="flex items-center space-x-4 pl-4 border-l border-light dark:border-dark">
            <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors">
              Login
            </Link>
            <Link to={ROUTES.DASHBOARD} className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-full transition-all shadow-md shadow-brand/10">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-950 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-page-dark border-b border-light dark:border-dark p-6 md:hidden transition-colors duration-300"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-bold text-slate-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-light dark:border-dark" />
              <Link to={ROUTES.DASHBOARD} className="text-lg font-bold text-slate-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors">Login</Link>
              <Link to={ROUTES.DASHBOARD} className="w-full py-3 bg-brand text-center text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-dark transition-colors">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
