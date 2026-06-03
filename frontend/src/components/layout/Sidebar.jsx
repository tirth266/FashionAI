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
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-purple-600 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
        }`
      }
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-dark border-r border-gray-800 h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Sparkles className="text-purple-500 mr-2" size={24} />
        <span className="text-xl font-bold text-white tracking-wide">StylePulse AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem to={ROUTES.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
        <NavItem to={ROUTES.RECOMMEND_PAGE} icon={Sparkles} label="Style Recommender" />
        <NavItem to={ROUTES.RECOMMENDATIONS} icon={Sparkles} label="AI Picks" />
        <NavItem to={ROUTES.OUTFITS} icon={Shirt} label="My Outfits" />
        <NavItem to={ROUTES.TRENDS} icon={TrendingUp} label="Trends" />
        <NavItem to={ROUTES.WISHLIST} icon={Heart} label="Wishlist" />
        <NavItem to={ROUTES.STYLIST_CHAT} icon={MessageSquare} label="AI Stylist" />
      </nav>
      <div className="p-4 border-t border-gray-800">
        <NavItem to={ROUTES.SETTINGS} icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};
