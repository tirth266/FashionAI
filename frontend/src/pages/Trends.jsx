import React from 'react';
import { TrendingUp, Award, Zap, ArrowUpRight } from 'lucide-react';

export const Trends = () => {
  const trendingTopics = [
    { title: "Y2K Revival", growth: "+145%", status: "Exploding", color: "text-purple-400" },
    { title: "Quiet Luxury", growth: "+82%", status: "Steady", color: "text-pink-400" },
    { title: "Eco-Futurism", growth: "+210%", status: "Viral", color: "text-blue-400" },
    { title: "Barbiecore", growth: "-12%", status: "Declining", color: "text-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Fashion Trends Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingTopics.map((trend, i) => (
          <div key={i} className="bg-dark p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start">
               <p className="text-sm text-gray-400">{trend.status}</p>
               <ArrowUpRight size={16} className={trend.color} />
            </div>
            <h3 className="text-lg font-bold text-white mt-2">{trend.title}</h3>
            <p className={`text-2xl font-bold mt-1 ${trend.color}`}>{trend.growth}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark p-6 rounded-xl border border-gray-800">
         <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Award className="text-purple-500 mr-2" size={20} />
            Style Insight Reports
         </h2>
         <div className="space-y-4">
            <div className="p-5 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">Summer 2024: The Rise of Tech-Linen</h4>
                    <p className="text-xs text-gray-500 mt-1">Published 2 hours ago • 8 min read</p>
                  </div>
                  <Zap size={18} className="text-yellow-500" />
                </div>
                <p className="text-sm mt-3 text-gray-300 leading-relaxed">
                    New textile innovations are blending traditional linen with moisture-wicking synthetic fibers, creating a new category of "smart summer wear" that's dominating runway collections...
                </p>
            </div>
            <div className="p-5 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">Color Report: Digital Lavender & Solar Orange</h4>
                    <p className="text-xs text-gray-500 mt-1">Published 1 day ago • 5 min read</p>
                  </div>
                  <Zap size={18} className="text-yellow-500" />
                </div>
                <p className="text-sm mt-3 text-gray-300 leading-relaxed">
                    AI-driven sentiment analysis across social media platforms indicates a massive shift towards high-saturation neon accents paired with soft, digital-inspired pastels...
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};
