import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stylepulse-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stylepulse-theme', 'light');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      className={`
        w-20 h-9 rounded-full relative flex items-center px-1 transition-all duration-300 outline-none
        ${isDark ? 'bg-brand' : 'bg-toggle-light'}
      `}
      aria-label="Toggle Theme"
    >
      {/* Thumb */}
      <div 
        className={`
          absolute w-7 h-7 bg-white rounded-full shadow-sm transition-all duration-300 transform
          ${isDark ? 'translate-x-11' : 'translate-x-0'}
        `}
      />
      
      {/* Icons/Labels */}
      <div className="flex w-full justify-between items-center z-10 px-0.5">
        <div className="flex-1 flex items-center justify-center space-x-0.5">
          <Sun size={12} className={!isDark ? 'text-brand' : 'text-gray-400'} />
          {!isDark && <span className="text-[9px] font-bold uppercase text-navy">Light</span>}
        </div>
        <div className="flex-1 flex items-center justify-center space-x-0.5">
          {isDark && <span className="text-[9px] font-bold uppercase text-white">Dark</span>}
          <Moon size={12} className={isDark ? 'text-white' : 'text-gray-400'} />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
