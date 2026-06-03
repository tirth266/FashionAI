import React from 'react';
import { Sparkles, Instagram, Twitter, Facebook, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-darker pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="text-purple-500" size={32} />
              <span className="text-2xl font-bold text-white">StylePulse AI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Empowering your personal style with institutional-grade AI and real-time fashion insights.
            </p>
            <div className="flex items-center space-x-4">
              {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400">Features</a></li>
              <li><a href="#" className="hover:text-purple-400">Outfit Builder</a></li>
              <li><a href="#" className="hover:text-purple-400">Trend Analysis</a></li>
              <li><a href="#" className="hover:text-purple-400">AI Stylist</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400">About Us</a></li>
              <li><a href="#" className="hover:text-purple-400">Careers</a></li>
              <li><a href="#" className="hover:text-purple-400">Press</a></li>
              <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400">Style Blog</a></li>
              <li><a href="#" className="hover:text-purple-400">Size Guide</a></li>
              <li><a href="#" className="hover:text-purple-400">Partner Brands</a></li>
              <li><a href="#" className="hover:text-purple-400">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-purple-400">Sustainability</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-gray-600 text-xs">
          <p>© 2024 StylePulse AI. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
             <span>AI Model Status: <span className="text-green-500">Optimized</span></span>
             <span>Region: Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
