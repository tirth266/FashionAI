import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Loader2, AlertCircle } from 'lucide-react';
import { sendMessage } from '../services/chatService';

export const StylistChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'initial',
      text: "Hello! I'm your StylePulse AI stylist. I'm here to help you elevate your look, recommend outfits, and stay on top of the latest fashion trends. What are we styling today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare history for the backend
      // Format: [{role: 'user', content: '...'}, {role: 'model', content: '...'}]
      const history = messages
        .filter(msg => msg.id !== 'initial' && !msg.isError)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      const response = await sendMessage(userMessageText, history);
      
      if (response.success) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get a response');
      }
    } catch (err) {
      console.error('Chat Error:', err);
      setError(err.message);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: err.message || "I'm having trouble connecting to my fashion database. Please try again in a moment.",
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
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand/10 rounded-xl">
            <MessageSquare size={28} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-950 dark:text-white tracking-tight">AI Fashion Stylist</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">Your personal style guide, powered by StylePulse AI</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-card-dark rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Messages Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-110 ${
                msg.sender === 'ai' ? 'bg-gradient-to-br from-purple-600 to-brand text-white' : 'bg-gray-900 dark:bg-gray-700'
              }`}>
                {msg.sender === 'ai' ? <Sparkles size={18} /> : <User size={18} className="text-gray-100" />}
              </div>
              
              <div className={`group relative flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === 'ai' 
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700' 
                    : 'bg-brand text-white rounded-tr-none'
                } ${msg.isError ? 'border-rose-500/50 bg-rose-500/5 text-rose-600 dark:text-rose-400' : ''}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed antialiased">
                    {msg.text}
                  </p>
                </div>
                <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest opacity-40 px-1 ${
                  msg.sender === 'ai' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white animate-spin-slow" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-gray-400 dark:text-gray-500 flex items-center space-x-2 border border-gray-100 dark:border-gray-700">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Curating style...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
           <form className="relative flex items-center gap-3" onSubmit={handleSend}>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe an occasion or ask for style advice..." 
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-5 pr-12 text-sm text-gray-900 dark:text-white outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Sparkles size={16} />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-brand hover:bg-brand-dark text-white p-3.5 rounded-xl shadow-lg shadow-brand/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 flex-shrink-0"
              >
                 <Send size={20} />
              </button>
           </form>
           
           <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-1 h-1 bg-brand rounded-full" />
                <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">StylePulse Fashion Engine</p>
              </div>
              <span className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
              <p className="text-[9px] text-violet-600 dark:text-violet-400 uppercase tracking-widest font-bold">Powered by Gemini AI</p>
           </div>
        </div>
      </div>
      
      {/* Quick Suggestions */}
      {!isLoading && messages.length < 3 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {[
            "Summer wedding outfit?",
            "Color matching for navy blue?",
            "Business casual trends?",
            "Style tips for my body type?"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => { setInput(suggestion); }}
              className="px-4 py-2 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand dark:hover:text-brand transition-all shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
