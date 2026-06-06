import React from 'react';
import { Sparkles, Shirt, TrendingUp, Heart } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-soft dark:shadow-none border border-transparent dark:border-gray-800 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-1">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-navy dark:text-white">{value}</h3>
      <p className={`text-xs font-medium mt-2 flex items-center ${colorClass}`}>
        <span className="mr-1">●</span> {change}
      </p>
    </div>
    <div className={`p-4 ${bgClass} rounded-2xl transition-colors`}>
      <Icon className={colorClass} size={24} />
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy dark:text-white tracking-tight">Fashion Summary</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, John! Here's what's happening with your style.</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-brand to-purple-500 hover:from-brand-dark hover:to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand/20 transition-all hover:scale-105 active:scale-95">
          <Sparkles size={18} />
          <span>New AI Picks</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Style Match" 
          value="94%" 
          change="+2% from yesterday" 
          icon={Sparkles} 
          colorClass="text-brand dark:text-brand-light" 
          bgClass="bg-brand-light dark:bg-brand/10"
        />
        <StatCard 
          title="Saved Outfits" 
          value="24" 
          change="+3 this week" 
          icon={Shirt} 
          colorClass="text-pink-500 dark:text-pink-400" 
          bgClass="bg-pink-50 dark:bg-pink-900/10"
        />
        <StatCard 
          title="Trending Now" 
          value="1.2k" 
          change="Matches your style" 
          icon={TrendingUp} 
          colorClass="text-positive" 
          bgClass="bg-emerald-50 dark:bg-positive/10"
        />
        <StatCard 
          title="Wishlist Items" 
          value="48" 
          change="5 on sale today" 
          icon={Heart} 
          colorClass="text-alert" 
          bgClass="bg-rose-50 dark:bg-alert/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-navy dark:text-white">Recommended for Today</h2>
            <button className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0">
                  <p className="text-white text-sm font-bold">Summer Ensemble #{i}</p>
                  <p className="text-brand-light text-xs mt-1">98% Match Score</p>
                  <button className="mt-4 w-full bg-white text-navy py-2 rounded-xl text-xs font-bold hover:bg-brand hover:text-white transition-colors">Quick View</button>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 transition-transform group-hover:scale-110">
                   <Shirt size={64} strokeWidth={1} />
                   <p className="text-[10px] mt-4 font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">AI Generated Preview</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card h-full">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Latest Trends</h2>
            <div className="space-y-4">
              <div className="p-5 bg-brand-light/30 border border-brand/10 rounded-2xl group hover:bg-brand-light/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-brand uppercase tracking-widest">Style Alert</p>
                  <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm font-semibold text-navy dark:text-gray-200 leading-relaxed">Monochromatic minimalism is trending in your preferred color palette.</p>
                <p className="text-[10px] text-gray-500 mt-3 font-medium">Updated 2h ago</p>
              </div>
              <div className="p-5 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20 rounded-2xl group hover:bg-pink-100/50 transition-colors cursor-pointer">
                <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2">Limited Drop</p>
                <p className="text-sm font-semibold text-navy dark:text-gray-200 leading-relaxed">Sustainable tech-wear collection launching tomorrow. Matches your recent searches.</p>
                <p className="text-[10px] text-gray-500 mt-3 font-medium">New arrival</p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center border-dashed cursor-pointer hover:border-brand transition-colors group">
                <p className="text-xs font-bold text-gray-400 group-hover:text-brand uppercase tracking-widest">+ Explore More Trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
