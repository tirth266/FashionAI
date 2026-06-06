import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 w-24 h-9 relative"
    >
      <div className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-gray-700 rounded-full shadow-sm transition-transform duration-300 transform ${isDark ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0.5'}`} />
      <div className="flex-1 flex items-center justify-center z-10 space-x-1">
        <Sun size={14} className={!isDark ? 'text-brand' : 'text-gray-500'} />
        <span className={`text-[10px] font-bold uppercase tracking-tighter ${!isDark ? 'text-navy' : 'text-gray-500'}`}>Light</span>
      </div>
      <div className="flex-1 flex items-center justify-center z-10 space-x-1">
        <Moon size={14} className={isDark ? 'text-brand-light' : 'text-gray-500'} />
        <span className={`text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-gray-500'}`}>Dark</span>
      </div>
    </button>
  );
};

export const Navbar = () => {
  return (
    <header className="h-16 bg-white/80 dark:bg-page-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 w-80 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search fashion, trends, styles..." 
          className="bg-transparent border-none outline-none text-sm w-full text-navy dark:text-gray-200 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand-light transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-page-dark"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-navy dark:text-white leading-none">John Doe</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Premium Member</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-brand to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
