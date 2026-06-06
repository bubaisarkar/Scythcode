'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Bot, MessageCircle, ArrowLeft, Lock,
  CheckCircle, Clock, Loader2, Users, LogIn, RefreshCw
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

interface Session {
  sessionId: string;
  userName: string;
  userEmail: string;
  startedAt: string;
  status: string;
  participants: Array<{ name: string; type: string; joinedAt: string }>;
}

const AdminLiveChat = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [otherPersonTyping, setOtherPersonTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('adminAuth');
        if (authData) {
          const { name, timestamp } = JSON.parse(authData);
          const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
          
          if (Date.now() - timestamp < oneHour) {
            setAdminName(name);
            setIsAuthenticated(true);
          } else {
            // Session expired
            localStorage.removeItem('adminAuth');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminAuth');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch active sessions
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSessions = async () => {
      try {
        const password = encodeURIComponent('K9#bV2!mQ8*zL5@xP1^rT');
        const response = await fetch(`/api/chat/sessions?password=${password}`);
        const data = await response.json();
        
        if (data.success) {
          setSessions(data.sessions);
          setLastUpdate(new Date());
          console.log('Fetched sessions:', data.sessions.length);
        } else {
          console.error('Failed to fetch sessions:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };

    // Fetch immediately
    fetchSessions();
    
    // Then poll every 1 second for instant session updates
    const interval = setInterval(fetchSessions, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleManualRefresh = async () => {
    try {
      const password = encodeURIComponent('K9#bV2!mQ8*zL5@xP1^rT');
      const response = await fetch(`/api/chat/sessions?password=${password}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
        setLastUpdate(new Date());
        console.log('Manual refresh - sessions:', data.sessions.length);
      }
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  // Poll for messages when session is selected
  useEffect(() => {
    if (!selectedSession || !isJoined) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?sessionId=${selectedSession.sessionId}`);
        const data = await response.json();
        
        if (data.success && data.messages) {
          const formattedMessages = data.messages.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            sender: msg.senderType,
            timestamp: new Date(msg.timestamp),
            status: 'sent',
            senderName: msg.sender,
          }));
          setMessages(formattedMessages);
          console.log('Fetched messages:', formattedMessages.length);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Fetch immediately
    pollMessages();
    
    // Then poll every 500ms for real-time updates
    const interval = setInterval(pollMessages, 500);

    return () => clearInterval(interval);
  }, [selectedSession, isJoined]);

  // Poll for typing status
  useEffect(() => {
    if (!selectedSession || !isJoined) return;

    const pollTyping = async () => {
      try {
        const response = await fetch(`/api/chat/typing?sessionId=${selectedSession.sessionId}`);
        const data = await response.json();
        
        if (data.success && data.isTyping && data.typingUser.userType !== 'admin') {
          setOtherPersonTyping(true);
        } else {
          setOtherPersonTyping(false);
        }
      } catch (error) {
        console.error('Failed to fetch typing status:', error);
      }
    };

    const interval = setInterval(pollTyping, 300);

    return () => clearInterval(interval);
  }, [selectedSession, isJoined]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'K9#bV2!mQ8*zL5@xP1^rT' && adminName.trim()) {
      // Save to localStorage with timestamp
      const authData = {
        name: adminName,
        timestamp: Date.now(),
      };
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      setIsAuthenticated(true);
    }
  };

  const handleJoinSession = async (session: Session) => {
    setSelectedSession(session);
    
    try {
      // Join the session
      const response = await fetch('/api/chat/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          adminName,
          password: 'K9#bV2!mQ8*zL5@xP1^rT',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsJoined(true);
        
        // Send system message
        await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            message: `${adminName} has joined the chat`,
            sender: 'System',
            senderType: 'system',
          }),
        });
      } else {
        console.error('Failed to join session:', data.error);
      }
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedSession) return;

    // Stop typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    await fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: selectedSession.sessionId,
        userName: adminName,
        userType: 'admin',
        isTyping: false,
      }),
    });

    const tempMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'admin',
      timestamp: new Date(),
      status: 'sending',
      senderName: adminName,
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.sessionId,
          message: inputMessage,
          sender: adminName,
          senderType: 'admin',
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

    if (!selectedSession) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing indicator
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: selectedSession.sessionId,
        userName: adminName,
        userType: 'admin',
        isTyping: true,
      }),
    });

    // Set timeout to stop typing indicator after 3 seconds
    const timeout = setTimeout(() => {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.sessionId,
          userName: adminName,
          userType: 'admin',
          isTyping: false,
        }),
      });
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setIsJoined(false);
    setMessages([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setAdminName('');
    setPassword('');
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-300">Enter credentials to access live chat admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Dante"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter admin password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Lock className="w-5 h-5" />
              <span>Login</span>
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

  // Sessions List Screen
  if (!selectedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Active Chat Sessions</h1>
                  <p className="text-gray-400">Logged in as {adminName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Last updated</p>
                  <p className="text-sm text-gray-300">{lastUpdate.toLocaleTimeString()}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManualRefresh}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Refresh sessions"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 text-center"
            >
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Sessions</h3>
              <p className="text-gray-500">Waiting for users to start a chat...</p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-pink-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{session.userName}</h3>
                          <p className="text-sm text-gray-400">{session.userEmail}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Started: {new Date(session.startedAt).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>Session ID: {session.sessionId.substring(0, 12)}...</span>
                      </div>

                      {session.participants.length > 1 && (
                        <div className="mt-2 flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">
                            {session.participants.filter(p => p.type === 'admin').map(p => p.name).join(', ')} joined
                          </span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinSession(session)}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Join Chat</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat Screen
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
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">{selectedSession.userName}</h2>
              <p className="text-xs text-gray-400">{selectedSession.userEmail}</p>
            </div>
          </div>
          
          <button
            onClick={handleBackToSessions}
            className="text-gray-400 hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Sessions</span>
          </button>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-sm border-x border-gray-700 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) =>
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
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === 'admin' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'admin' ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    }`}>
                      {message.sender === 'admin' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <p className={`text-xs font-semibold mb-1 px-1 ${
                        message.sender === 'admin' ? 'text-pink-400 text-right' : 'text-cyan-400'
                      }`}>
                        {message.senderName}
                      </p>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'admin'
                          ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-400 ${
                        message.sender === 'admin' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.sender === 'admin' && message.status === 'sent' && (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                        {message.sender === 'admin' && message.status === 'sending' && (
                          <Clock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
            
            {otherPersonTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
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
              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            Chatting as {adminName} • Messages are synced in real-time
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLiveChat;
