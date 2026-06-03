import React from 'react';
import { Sparkles, Shirt, TrendingUp, Heart } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, colorClass }) => (
  <div className="bg-dark p-6 rounded-xl border border-gray-800 flex items-center justify-between transition-transform hover:scale-[1.02]">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      <p className={`text-sm mt-2 ${colorClass}`}>
        {change}
      </p>
    </div>
    <div className="p-4 bg-gray-800 rounded-lg">
      <Icon className={colorClass} size={24} />
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Fashion Summary</h1>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Sparkles size={18} />
          <span>New AI Picks</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Style Match" value="94%" change="+2% from yesterday" icon={Sparkles} colorClass="text-purple-400" />
        <StatCard title="Saved Outfits" value="24" change="+3 this week" icon={Shirt} colorClass="text-pink-400" />
        <StatCard title="Trending Now" value="1.2k" change="Items matching your style" icon={TrendingUp} colorClass="text-blue-400" />
        <StatCard title="Wishlist Items" value="48" change="5 on sale today" icon={Heart} colorClass="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark p-6 rounded-xl border border-gray-800 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recommended for Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium">Summer Ensemble #{i}</p>
                  <p className="text-purple-400 text-xs">98% Match</p>
                </div>
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                   <Shirt size={48} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-dark p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Latest Trends</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
              <p className="text-sm text-purple-400 font-medium">Style Alert</p>
              <p className="text-sm mt-1 text-gray-300">Monochromatic minimalism is trending in your preferred color palette.</p>
            </div>
            <div className="p-4 bg-pink-900/20 border border-pink-800/50 rounded-lg">
              <p className="text-sm text-pink-400 font-medium">Limited Drop</p>
              <p className="text-sm mt-1 text-gray-300">Sustainable tech-wear collection launching tomorrow. Matches your recent searches.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
