import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Shirt, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Settings 
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-brand-light dark:bg-brand/10 text-violet-600 dark:text-violet-400 font-semibold' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-violet-600 dark:hover:text-violet-400 font-medium'
        }`
      }
    >
      <Icon size={20} className="flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-[240px] bg-white dark:bg-sidebar-dark border-r border-light dark:border-dark h-screen sticky top-0 flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-light dark:border-dark">
        <Sparkles className="text-brand mr-2" size={24} />
        <span className="text-xl font-bold text-gray-950 dark:text-white tracking-tight italic">StylePulse AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <NavItem to={ROUTES.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
        <NavItem to={ROUTES.RECOMMEND_PAGE} icon={Sparkles} label="Style Recommender" />
        <NavItem to={ROUTES.RECOMMENDATIONS} icon={Sparkles} label="AI Picks" />
        <NavItem to={ROUTES.OUTFITS} icon={Shirt} label="My Outfits" />
        <NavItem to={ROUTES.TRENDS} icon={TrendingUp} label="Trends" />
        <NavItem to={ROUTES.WISHLIST} icon={Heart} label="Wishlist" />
        <NavItem to={ROUTES.STYLIST_CHAT} icon={MessageSquare} label="AI Stylist" />
      </nav>
      <div className="p-4 border-t border-light dark:border-dark">
        <NavItem to={ROUTES.SETTINGS} icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};
