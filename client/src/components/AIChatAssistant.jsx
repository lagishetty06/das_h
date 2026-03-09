import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import aiService from '../api/aiService';
import useTasks from '../hooks/useTasks';
import { toast } from 'react-toastify';
import { Sparkles, Send, Loader2, Calendar, Star, CheckCircle, ListTodo, Clock, TrendingUp } from 'lucide-react';

// DASH "D" Logo Component
const DashLogo = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
    <span className="text-white font-bold text-lg">D</span>
  </div>
);

// Loading animation
const LoadingDots = () => (
  <div className="flex space-x-1.5 items-center py-1">
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

// Quick suggestion chips
const QuickSuggestions = ({ onSelect, disabled }) => {
  const suggestions = [
    { icon: ListTodo, text: "Show my tasks", link: "/tasks" },
    { icon: Star, text: "What's starred?", link: "/tasks/starred" },
    { icon: Clock, text: "What's overdue?", link: null },
    { icon: CheckCircle, text: "Completed tasks", link: "/tasks/completed" },
    { icon: Calendar, text: "Open Calendar", link: "/tasks/calendar" },
    { icon: TrendingUp, text: "Task statistics", link: null },
    { icon: Sparkles, text: "Create a task", link: null }
  ];

  return (
    <div className="flex gap-2 mb-3 overflow-x-auto flex-nowrap pr-1">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion.text, suggestion.link)}
          disabled={disabled}
          className="shrink-0 group flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <suggestion.icon className="w-3.5 h-3.5" />
          {suggestion.text}
        </button>
      ))}
    </div>
  );
};

// Parse and format AI response with links
const MessageContent = ({ text }) => {
  // Detect links in the format [text](url)
  const parseLinks = (content) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      // Add the link
      parts.push({ type: 'link', text: match[1], url: match[2] });
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  // Split by newlines and format
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        const parts = parseLinks(line);

        // Check if line is a bullet point or numbered list
        const isBullet = /^[-•]\s/.test(line);
        const isNumbered = /^\d+\.\s/.test(line);

        return (
          <div key={lineIndex} className={`${isBullet || isNumbered ? 'ml-3' : ''}`}>
            {parts.map((part, partIndex) => {
              if (part.type === 'link') {
                return (
                  <Link
                    key={partIndex}
                    to={part.url}
                    className="text-indigo-600 hover:text-indigo-800 underline font-medium transition-colors"
                  >
                    {part.text}
                  </Link>
                );
              }
              return <span key={partIndex}>{part.content || '\u00A0'}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const AIChatAssistant = () => {
  // Load chat history from sessionStorage on mount
  const loadChatHistory = () => {
    try {
      const saved = sessionStorage.getItem('dashAiChatHistory');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [
      {
        sender: 'ai',
        text: 'Hello! I\'m your DASH assistant. I can help you manage tasks, answer questions, and navigate the app. Try one of the suggestions below or ask me anything!'
      }
    ];
  };

  const [messages, setMessages] = useState(loadChatHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refetchTasks } = useTasks();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    try {
      sessionStorage.setItem('dashAiChatHistory', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleQuickAction = async (text, link) => {
    if (link) {
      // If there's a direct link, navigate to it
      const aiMessage = {
        sender: 'ai',
        text: `Sure! Opening [${text}](${link}) for you.`
      };
      setMessages(prev => [...prev, { sender: 'user', text }, aiMessage]);
    } else {
      // Otherwise, send to AI
      await sendMessage(text);
    }
  };

  const _clearChat = () => {
    const initialMessage = {
      sender: 'ai',
      text: 'Hello! I\'m your DASH assistant. I can help you manage tasks, answer questions, and navigate the app. Try one of the suggestions below or ask me anything!'
    };
    setMessages([initialMessage]);
    sessionStorage.removeItem('dashAiChatHistory');
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.sendAiCommand(messageText);

      let aiResponseText = '';
      if (response.task) {
        aiResponseText = response.message || 'Action completed successfully!';
        await refetchTasks();
      } else if (response.answer) {
        aiResponseText = response.answer;
      } else if (response.message) {
        aiResponseText = response.message;
      }

      // Add navigation suggestions to certain responses
      if (aiResponseText.includes('task') || aiResponseText.includes('Task')) {
        aiResponseText += '\n\nView your [All Tasks](/tasks) or [Starred Tasks](/tasks/starred).';
      }

      const aiMessage = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      toast.error(errorMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: `⚠️ ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DashLogo />
          <div>
            <h3 className="text-lg font-bold text-white">DASH Assistant</h3>
            <p className="text-xs text-indigo-100">Powered by AI</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 mr-2">
                <DashLogo />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
              <div className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'font-medium' : ''}`}>
                {msg.sender === 'ai' ? <MessageContent text={msg.text} /> : msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex-shrink-0 mr-2">
              <DashLogo />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions - Always visible */}
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <p className="sr-only">Quick Actions</p>
        <QuickSuggestions onSelect={handleQuickAction} disabled={isLoading} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or create a task..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          AI responses may vary. Always verify important information.
        </p>
      </div>
    </div>
  );
};

export default AIChatAssistant;
