import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="h-16 bg-dark border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center bg-darker rounded-md px-3 py-1.5 border border-gray-700 w-64">
        <Search size={18} className="text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search fashion..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
          <span className="text-sm font-medium text-gray-300 hidden md:block">John Doe</span>
        </div>
      </div>
    </header>
  );
};
