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
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-brand-light dark:bg-brand/10 rounded-xl">
          <MessageSquare size={28} className="text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-950 dark:text-white tracking-tight">AI Fashion Stylist</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">Expert style advice, powered by StylePulse AI</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors duration-300">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'ai' ? 'bg-brand' : 'bg-gray-900 dark:bg-gray-700'
              }`}>
                {msg.sender === 'ai' ? <Sparkles size={20} className="text-white" /> : <User size={20} className="text-gray-100" />}
              </div>
              <div className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${
                msg.sender === 'ai' 
                  ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700' 
                  : 'bg-brand text-white rounded-tr-none'
              } ${msg.isError ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : ''}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-3 block font-bold uppercase tracking-widest opacity-60 ${
                  msg.sender === 'ai' ? 'text-gray-500' : 'text-violet-200'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 text-gray-400 flex items-center space-x-2 border border-gray-100 dark:border-gray-700">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Stylist is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
           <form 
             className="relative flex items-center space-x-3" 
             onSubmit={(e) => {
               e.preventDefault();
               handleSend();
             }}
           >
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for outfit ideas, trends, or style tips..." 
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 px-5 pr-12 text-gray-900 dark:text-white outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-sm"
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <MessageSquare size={18} />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-brand hover:bg-brand-dark text-white p-4 rounded-2xl shadow-lg shadow-brand/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
              >
                 <Send size={20} />
              </button>
           </form>
           <div className="flex justify-center items-center space-x-4 mt-4">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Powered by StylePulse AI</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <p className="text-[10px] text-brand uppercase tracking-widest font-bold">Gemini 1.5 Pro</p>
           </div>
        </div>
      </div>
    </div>
  );
};
