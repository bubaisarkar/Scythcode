'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Bot, MessageCircle, ArrowLeft, 
  CheckCircle, Clock, Loader2, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'admin';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  senderName?: string;
}

const LiveChat = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherPersonTyping, setOtherPersonTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages every 500ms for real-time feel
  useEffect(() => {
    if (!sessionId) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
          cache: 'no-store',
        });
        const data = await response.json();
        
        if (data.success && data.messages) {
          const newMessages = data.messages.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            sender: msg.senderType,
            timestamp: new Date(msg.timestamp),
            status: 'sent',
            senderName: msg.sender,
          }));
          
          // Only update if messages changed to avoid unnecessary re-renders
          setMessages(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(newMessages)) {
              return newMessages;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Initial fetch
    pollMessages();
    
    // Poll every 500ms for faster updates
    const interval = setInterval(pollMessages, 500);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Poll for typing status every 300ms for instant feedback
  useEffect(() => {
    if (!sessionId) return;

    const pollTyping = async () => {
      try {
        const response = await fetch(`/api/chat/typing?sessionId=${sessionId}`, {
          cache: 'no-store',
        });
        const data = await response.json();
        
        if (data.success && data.isTyping && data.typingUser.userType !== 'user') {
          setOtherPersonTyping(true);
        } else {
          setOtherPersonTyping(false);
        }
      } catch (error) {
        console.error('Failed to fetch typing status:', error);
        setOtherPersonTyping(false);
      }
    };

    const interval = setInterval(pollTyping, 300);

    return () => clearInterval(interval);
  }, [sessionId]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      try {
        const response = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, userEmail }),
        });

        const data = await response.json();

        if (data.success) {
          setSessionId(data.session.sessionId);
          setIsSetup(true);
          
          // Add welcome message
          setMessages([
            {
              id: '1',
              text: `Welcome ${userName}! 👋 An admin will join shortly to assist you.`,
              sender: 'system',
              timestamp: new Date(),
              status: 'sent',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Stop typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    await fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userName,
        userType: 'user',
        isTyping: false,
      }),
    });

    const tempMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      senderName: userName,
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: inputMessage,
          sender: userName,
          senderType: 'user',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing indicator
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userName,
        userType: 'user',
        isTyping: true,
      }),
    });

    // Set timeout to stop typing indicator after 3 seconds
    const timeout = setTimeout(() => {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userName,
          userType: 'user',
          isTyping: false,
        }),
      });
    }, 3000);

    setTypingTimeout(timeout);
  };

  const quickReplies = [
    'I need a website',
    'Discord bot development',
    'What are your prices?',
    'How long does it take?',
    'Can you help with my project?',
  ];

  const handleQuickReply = (text: string) => {
    setInputMessage(text);
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 gradient-bg-1 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Start Live Chat</h2>
            <p className="text-gray-300">Let us know who you are to get started</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="john@example.com"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full gradient-bg-1 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Chatting</span>
            </motion.button>
          </form>

          <button
            onClick={() => router.back()}
            className="w-full mt-4 text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20 pb-4">
      <div className="container mx-auto px-4 max-w-4xl h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-t-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg-1 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Medusa Support</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-sm border-x border-gray-700 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              message.sender === 'system' ? (
                // System message (centered)
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-gray-700/50 px-4 py-2 rounded-full text-xs text-gray-300 max-w-[80%] text-center">
                    {message.text}
                  </div>
                </motion.div>
              ) : (
                // User or Admin message
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'bg-cyan-500' : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div>
                      {message.sender === 'admin' && (
                        <p className="text-xs text-green-400 font-semibold mb-1 px-1">
                          {message.senderName || 'Admin'}
                        </p>
                      )}
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gradient-to-br from-green-600 to-emerald-700 text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-400 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.sender === 'user' && message.status === 'sent' && (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                        {message.sender === 'user' && message.status === 'sending' && (
                          <Clock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
            
            {otherPersonTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end space-x-2"
              >
                <div className="w-8 h-8 gradient-bg-1 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-700 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-x border-gray-700 p-3">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-full transition-colors"
              >
                {reply}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-b-2xl p-4"
        >
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputMessage.trim()}
              className="gradient-bg-1 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            Messages are synced in real-time • An admin will respond shortly
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveChat;
