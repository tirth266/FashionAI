import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export const Wishlist = () => {
  const wishlistItems = [
    { id: 1, name: "Cashmere Turtleneck", brand: "LuxeWear", price: "$210.00", status: "In Stock" },
    { id: 2, name: "Leather Chelsea Boots", brand: "Stride", price: "$185.00", status: "Low Stock" },
    { id: 3, name: "Velvet Evening Clutch", brand: "Gala", price: "$95.00", status: "In Stock" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center">
        <Heart className="text-red-500 mr-2" fill="currentColor" size={24} />
        My Wishlist
      </h1>

      <div className="bg-dark rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {wishlistItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                       <ShoppingCart size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-white font-medium">{item.price}</td>
                <td className="p-4">
                   <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {item.status}
                   </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <ShoppingCart size={18} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
