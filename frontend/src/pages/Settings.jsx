import React from 'react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Style Preferences</h1>
      <div className="bg-dark p-6 rounded-xl border border-gray-800 max-w-2xl">
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Style</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-purple-500 transition-colors">
                        <option>Minimalist</option>
                        <option>Streetwear</option>
                        <option>Bohemian</option>
                        <option>Vintage</option>
                        <option>Avant-Garde</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Primary Size</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-purple-500 transition-colors">
                        <option>Extra Small (XS)</option>
                        <option>Small (S)</option>
                        <option>Medium (M)</option>
                        <option>Large (L)</option>
                        <option>Extra Large (XL)</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Color Palette Interests</label>
                <div className="flex flex-wrap gap-3">
                    {['Neutrals', 'Pastels', 'Earth Tones', 'Neons', 'Monochrome'].map((color) => (
                        <label key={color} className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700 cursor-pointer hover:border-purple-500 transition-colors">
                            <input type="checkbox" className="accent-purple-500" defaultChecked={color === 'Neutrals' || color === 'Monochrome'} />
                            <span className="text-sm text-gray-300">{color}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">AI Recommendation Level</label>
                <input type="range" className="w-full accent-purple-600 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Adventurous</span>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end">
              <button type="button" className="py-2.5 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                  Save Style Profile
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};
