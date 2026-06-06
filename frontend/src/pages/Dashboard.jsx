import React from 'react';
import { Sparkles, Shirt, TrendingUp, Heart } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, colorClass, bgClass, isTrendPositive }) => (
  <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-soft dark:shadow-none border border-card-light dark:border-card-dark flex items-center justify-between transition-all hover:scale-[1.01]">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-[28px] font-bold mt-2 text-gray-950 dark:text-white leading-tight">{value}</h3>
      <p className={`text-xs font-bold mt-2 flex items-center ${
        isTrendPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
      }`}>
        {change}
      </p>
    </div>
    <div className={`p-4 ${bgClass} rounded-2xl`}>
      <Icon className={colorClass} size={24} />
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 dark:text-white tracking-tight">Fashion Summary</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Welcome back, John! Your style pulse is strong.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2 text-white">
          <Sparkles size={18} />
          <span>New AI Picks</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Style Match" 
          value="94%" 
          change="+2% from yesterday" 
          isTrendPositive={true}
          icon={Sparkles} 
          colorClass="text-violet-600 dark:text-violet-400" 
          bgClass="bg-brand-light dark:bg-icon-dark"
        />
        <StatCard 
          title="Saved Outfits" 
          value="24" 
          change="+3 this week" 
          isTrendPositive={true}
          icon={Shirt} 
          colorClass="text-pink-500 dark:text-pink-400" 
          bgClass="bg-pink-50 dark:bg-icon-dark"
        />
        <StatCard 
          title="Trending Now" 
          value="1.2k" 
          change="Matches your style" 
          isTrendPositive={true}
          icon={TrendingUp} 
          colorClass="text-emerald-500 dark:text-emerald-400" 
          bgClass="bg-emerald-50 dark:bg-icon-dark"
        />
        <StatCard 
          title="Wishlist Items" 
          value="48" 
          change="5 on sale today" 
          isTrendPositive={false}
          icon={Heart} 
          colorClass="text-rose-500 dark:text-rose-400" 
          bgClass="bg-rose-50 dark:bg-icon-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recommended for Today</h2>
            <button className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-card-light dark:border-card-dark transition-all hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <p className="text-white text-sm font-bold">Summer Ensemble #{i}</p>
                  <p className="text-violet-300 text-xs mt-1 font-bold">98% Match Score</p>
                  <button className="mt-4 w-full bg-white text-gray-950 py-2 rounded-xl text-xs font-bold hover:bg-violet-600 hover:text-white transition-colors">Quick View</button>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 transition-transform group-hover:scale-105">
                   <Shirt size={64} strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card h-full">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6">Latest Trends</h2>
            <div className="space-y-4">
              <div className="p-5 bg-brand-light/50 dark:bg-brand/5 border border-brand/10 rounded-2xl hover:bg-brand-light dark:hover:bg-brand/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Style Alert</p>
                  <div className="w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full"></div>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-relaxed">Monochromatic minimalism is trending in your palette.</p>
              </div>
              <div className="p-5 bg-rose-50 dark:bg-rose-900/5 border border-rose-100 dark:border-rose-900/10 rounded-2xl hover:bg-rose-100/50 dark:hover:bg-rose-900/10 transition-colors cursor-pointer">
                <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-2">Limited Drop</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-relaxed">Sustainable tech-wear collection launching tomorrow.</p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-white/5 border border-card-light dark:border-card-dark rounded-2xl flex items-center justify-center border-dashed cursor-pointer hover:border-brand transition-colors group">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 uppercase tracking-widest transition-colors">Explore Trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
