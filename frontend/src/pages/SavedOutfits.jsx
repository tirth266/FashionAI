import React from 'react';
import { Shirt, Trash2, Edit3, Calendar } from 'lucide-react';

export const SavedOutfits = () => {
  const outfits = [
    { id: 1, name: "Business Casual", items: 4, date: "2 days ago", color: "bg-purple-600" },
    { id: 2, name: "Weekend Brunch", items: 3, date: "1 week ago", color: "bg-pink-600" },
    { id: 3, name: "Evening Gala", items: 5, date: "2 weeks ago", color: "bg-blue-600" },
    { id: 4, name: "Gym Session", items: 3, date: "3 weeks ago", color: "bg-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Saved Outfits</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Shirt size={18} />
          <span>Create New Outfit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="bg-dark rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all group">
            <div className={`aspect-square ${outfit.color} opacity-80 flex items-center justify-center relative group-hover:opacity-100 transition-opacity`}>
              <Shirt size={64} className="text-white/20" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                 <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                    <Edit3 size={20} />
                 </button>
                 <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/60 transition-colors">
                    <Trash2 size={20} />
                 </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{outfit.name}</h3>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                <span className="flex items-center">
                  <Shirt size={14} className="mr-1" /> {outfit.items} items
                </span>
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" /> {outfit.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
