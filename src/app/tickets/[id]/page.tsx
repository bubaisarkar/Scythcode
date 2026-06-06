'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  Tag,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: number;
  sender_type: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface TicketDetail {
  id: number;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TicketDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id;
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
      fetchMessages();
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch(`/api/tickets?ticketId=${ticketId}`);
      const data = await response.json();
      if (data.success && data.tickets.length > 0) {
        setTicket(data.tickets[0]);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/tickets/messages?ticketId=${ticketId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/tickets/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticketId,
          senderType: 'user',
          senderName: user?.displayName || user?.email?.split('@')[0] || 'User',
          senderEmail: user?.email,
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    open: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
    'in-progress': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertCircle },
    resolved: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
    closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: CheckCircle },
  };

  const priorityColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  const StatusIcon = statusColors[ticket.status]?.icon || Clock;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tickets
            </Link>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-cyan-400 font-mono font-semibold text-lg">
                      {ticket.ticket_number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        statusColors[ticket.status]?.bg
                      } ${statusColors[ticket.status]?.text} flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">{ticket.subject}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {ticket.category}
                    </span>
                    <span className={`font-medium ${priorityColors[ticket.priority]}`}>
                      Priority: {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
              >
                {/* Messages Header */}
                <div className="bg-gray-900/50 border-b border-gray-700 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Conversation</h2>
                    <span className="text-sm text-gray-400">({messages.length} messages)</span>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="p-4 h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${
                          msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.sender_type === 'system' ? (
                          <div className="bg-gray-700/50 px-4 py-2 rounded-full text-xs text-gray-300 text-center max-w-[80%]">
                            {msg.message}
                          </div>
                        ) : (
                          <div
                            className={`flex items-end gap-2 max-w-[80%] ${
                              msg.sender_type === 'user' ? 'flex-row-reverse' : ''
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.sender_type === 'user'
                                  ? 'bg-cyan-500'
                                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
                              }`}
                            >
                              {msg.sender_type === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              {msg.sender_type === 'admin' && (
                                <p className="text-xs text-green-400 font-semibold mb-1 px-1">
                                  {msg.sender_name}
                                </p>
                              )}
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  msg.sender_type === 'user'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gradient-to-br from-green-600 to-emerald-700 text-white'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 px-1">
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                {ticket.status !== 'closed' && (
                  <div className="bg-gray-900/50 border-t border-gray-700 p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Ticket Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                          statusColors[ticket.status]?.bg
                        } ${statusColors[ticket.status]?.text}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Priority</p>
                      <p className={`font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Category</p>
                      <p className="text-white">{ticket.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Created</p>
                      <p className="text-white">
                        {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                      <p className="text-white">
                        {new Date(ticket.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {ticket.status === 'closed' && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 text-center">
                      This ticket has been closed. Contact support if you need to reopen it.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
