import React from 'react';
import { Sparkles, X } from 'lucide-react';

const FloatingAIChatButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
        isOpen 
          ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
          : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
      } text-white focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        isOpen ? 'focus:ring-red-400' : 'focus:ring-indigo-400'
      } animate-pulse hover:animate-none`}
      aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Sparkles className="w-6 h-6" />
      )}
    </button>
  );
};

export default FloatingAIChatButton;









