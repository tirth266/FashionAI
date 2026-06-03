import React from 'react';
import { Sparkles, Heart, Share2, ShoppingCart } from 'lucide-react';

export const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      name: "Modern Minimalist Blazer",
      brand: "Urban Chic",
      match: "98%",
      price: "$129.00",
      reason: "Matches your preference for structured silhouettes and neutral tones.",
      color: "text-purple-400"
    },
    {
      id: 2,
      name: "Silk Flowing Maxi Dress",
      brand: "Etheria",
      match: "95%",
      price: "$185.00",
      reason: "Trending in your area and aligns with your interest in sustainable fabrics.",
      color: "text-pink-400"
    },
    {
      id: 3,
      name: "Tech-Knit Sneakers",
      brand: "AeroStep",
      match: "92%",
      price: "$140.00",
      reason: "Perfect addition to your active-wear collection based on recent activity.",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Sparkles size={32} className="text-purple-500" />
        <h1 className="text-2xl font-bold text-white">AI Curated Picks</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="bg-dark rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors group">
            <div className="aspect-[4/5] bg-gray-800 flex items-center justify-center relative">
              <span className={`absolute top-4 right-4 bg-dark/80 backdrop-blur-sm ${item.color} px-3 py-1 rounded-full text-xs font-bold border border-gray-700`}>
                {item.match} Match
              </span>
              <div className="text-gray-600 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={64} />
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-purple-400 font-medium uppercase tracking-wider">{item.brand}</p>
                <h3 className="text-lg font-bold text-white mt-1">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  {item.reason}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{item.price}</span>
                <div className="flex space-x-2">
                  <button className="p-2 bg-gray-800 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-700">
                    <Heart size={18} />
                  </button>
                  <button className="p-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
