import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { sendMessage } from '../services/chatService';

export const StylistChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your StylePulse AI stylist. I've analyzed your recent saved outfits and trends. How can I help you elevate your look today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      const aiMessage = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare size={32} className="text-purple-500" />
        <h1 className="text-2xl font-bold text-white">AI Fashion Stylist</h1>
      </div>

      <div className="flex-1 bg-dark rounded-xl border border-gray-800 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'ai' ? 'bg-purple-600' : 'bg-gray-700'
              }`}>
                {msg.sender === 'ai' ? <Sparkles size={20} className="text-white" /> : <User size={20} className="text-gray-300" />}
              </div>
              <div className={`rounded-2xl p-4 max-w-[80%] ${
                msg.sender === 'ai' 
                  ? 'bg-gray-800 text-gray-200 rounded-tl-none' 
                  : 'bg-purple-600 text-white rounded-tr-none'
              } ${msg.isError ? 'border border-red-500/50' : ''}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-2 block ${
                  msg.sender === 'ai' ? 'text-gray-500' : 'text-purple-200'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 text-gray-400 flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
           <form 
             className="relative" 
             onSubmit={(e) => {
               e.preventDefault();
               handleSend();
             }}
           >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your stylist anything..." 
                className="w-full bg-dark border border-gray-700 rounded-xl py-3 px-4 pr-12 text-white outline-none focus:border-purple-500 transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400 disabled:text-gray-600"
              >
                 <Send size={20} />
              </button>
           </form>
           <p className="text-[10px] text-gray-500 text-center mt-2 uppercase tracking-widest font-medium">Powered by StylePulse AI Engine (Gemini)</p>
        </div>
      </div>
    </div>
  );
};
