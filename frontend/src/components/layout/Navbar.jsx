import React from 'react';
import { Bell, Search } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

export const Navbar = () => {
  return (
    <header className="h-16 bg-white dark:bg-header-dark border-b border-header-light dark:border-header-dark flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center bg-search-light dark:bg-search-dark rounded-xl px-4 py-2 border border-search-light dark:border-search-dark w-80 focus-within:ring-2 focus-within:ring-brand/10 transition-all">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search fashion..." 
          className="bg-transparent border-none outline-none text-sm w-full text-navy dark:text-white placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-brand transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-page-dark"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-navy dark:text-white leading-none">John Doe</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Premium Member</p>
          </div>
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
