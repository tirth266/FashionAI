import React from 'react';
import { MessageSquare, Send, Sparkles, User } from 'lucide-react';

export const StylistChat = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare size={32} className="text-purple-500" />
        <h1 className="text-2xl font-bold text-white">AI Fashion Stylist</h1>
      </div>

      <div className="flex-1 bg-dark rounded-xl border border-gray-800 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex items-start space-x-4">
             <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
             </div>
             <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-200">
                <p>Hello! I'm your StylePulse AI stylist. I've analyzed your recent saved outfits and trends. How can I help you elevate your look today?</p>
                <span className="text-[10px] text-gray-500 mt-2 block">10:00 AM</span>
             </div>
          </div>

          <div className="flex items-start space-x-4 flex-row-reverse space-x-reverse">
             <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-300" />
             </div>
             <div className="bg-purple-600 rounded-2xl rounded-tr-none p-4 max-w-[80%] text-white">
                <p>I'm looking for a professional but creative outfit for a gallery opening. Any suggestions?</p>
                <span className="text-[10px] text-purple-200 mt-2 block">10:02 AM</span>
             </div>
          </div>

          <div className="flex items-start space-x-4">
             <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
             </div>
             <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-200">
                <p>For a gallery opening, I recommend a tailored monochromatic look with a statement accessory. Try your charcoal oversized blazer with the silk trousers we found yesterday. Add a bold metallic necklace to bring that creative edge!</p>
                <span className="text-[10px] text-gray-500 mt-2 block">10:03 AM</span>
             </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your stylist anything..." 
                className="w-full bg-dark border border-gray-700 rounded-xl py-3 px-4 pr-12 text-white outline-none focus:border-purple-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400">
                 <Send size={20} />
              </button>
           </div>
           <p className="text-[10px] text-gray-500 text-center mt-2 uppercase tracking-widest font-medium">Powered by StylePulse AI Engine</p>
        </div>
      </div>
    </div>
  );
};
