
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Paperclip, Minimize2, Loader, School } from 'lucide-react';
import { chatWithConsultant } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for custom open event
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    
    window.addEventListener('open-chat-bot', handleOpenEvent);
    return () => window.removeEventListener('open-chat-bot', handleOpenEvent);
  }, []);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      // Reduced delay to 500ms for snappier experience
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: 'welcome-1',
          role: 'model',
          text: "🏫 Welcome to Zambians In India Support!\n\nI’m Melisa, your student advisor.\nHow may I help you today? 😊",
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
        setIsTyping(false);
      }, 500); 
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await chatWithConsultant(history, userMsg.text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble connecting to the server. ⚠️",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 group cursor-pointer animate-fade-in-up"
        title="Student Affairs Office"
      >
        <div className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center relative border-4 border-white">
            <School className="w-6 h-6" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-orange-500"></span>
            </span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-[60] transition-all duration-300 ease-in-out shadow-2xl overflow-hidden font-sans flex flex-col
      ${isMinimized 
        ? 'bottom-24 right-6 w-72 h-14 rounded-full bg-emerald-900 cursor-pointer' 
        : 'bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-96 md:h-[550px] md:rounded-2xl bg-white border border-slate-200'
      }`}
    >
      {/* Header */}
      <div 
        className={`bg-emerald-900 text-white p-4 flex items-center justify-between ${isMinimized ? 'h-full' : ''}`}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white overflow-hidden">
               <Bot className="w-6 h-6 text-white"/>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-emerald-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">Student Affairs Office</h3>
            {!isMinimized && <p className="text-[10px] text-emerald-200 flex items-center">Official Support • Online</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isMinimized && (
            <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-emerald-800 rounded">
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} 
            className="p-1 hover:bg-emerald-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
            {/* Disclaimer */}
            <div className="text-center mb-6">
              <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString()}
              </span>
              <p className="text-[10px] text-slate-400 mt-2">
                Messages are monitored for quality and training purposes.
              </p>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-2">
               <a href="https://elevenlabs.io/app/talk-to?agent_id=agent_6801kgqxsbrmf7y9ycydz31tcwm0&branch_id=agtbrch_6601kgqxsdxsefxb7qxxgz2r9by7" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center justify-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                  Prefer to speak? Call Melisa Live
               </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
