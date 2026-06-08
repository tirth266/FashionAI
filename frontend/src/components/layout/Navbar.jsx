import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-header-dark border-b border-header-light dark:border-header-dark flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex items-center bg-search-light dark:bg-search-dark rounded-xl px-4 py-2 border border-search-light dark:border-search-dark w-80 focus-within:ring-2 focus-within:ring-brand/10 transition-all">
        <Search size={18} className="text-gray-400 dark:text-gray-600 mr-2" />
        <input 
          type="text" 
          placeholder="Search fashion..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-brand transition-colors" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-page-dark"></span>
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {user?.email?.split('@')[0] || 'Premium Member'}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.substring(0, 2).toUpperCase() || 'JD')
                )}
              </div>
              <ChevronDown size={14} className={`ml-1 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-light dark:border-dark overflow-hidden py-2"
              >
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-brand transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={18} />
                  <span className="font-semibold">Profile</span>
                </Link>
                <Link 
                  to={ROUTES.SETTINGS} 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-brand transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings size={18} />
                  <span className="font-semibold">Settings</span>
                </Link>
                <hr className="my-2 border-light dark:border-dark" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-bold">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
