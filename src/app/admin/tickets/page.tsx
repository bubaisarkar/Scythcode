'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Ticket,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Send,
  X,
  LogOut,
} from 'lucide-react';

interface TicketType {
  id: number;
  ticket_number: string;
  user_name: string;
  user_email: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  sender_type: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export default function AdminTicketsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('adminTicketAuth');
    if (authData) {
      const { name, timestamp } = JSON.parse(authData);
      // Check if auth is still valid (24 hours)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        setAdminName(name);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminTicketAuth');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
      const interval = setInterval(fetchTickets, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedTicket]);

  useEffect(() => {
    let filtered = tickets;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [statusFilter, searchTerm, tickets]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets?admin=true');
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedTicket) return;
    try {
      const response = await fetch(`/api/tickets/messages?ticketId=${selectedTicket.id}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'K9#bV2!mQ8*zL5@xP1^rT' && adminName.trim()) {
      setIsAuthenticated(true);
      localStorage.setItem(
        'adminTicketAuth',
        JSON.stringify({ name: adminName, timestamp: Date.now() })
      );
    } else {
      alert('Invalid password or admin name');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminName('');
    setPassword('');
    localStorage.removeItem('adminTicketAuth');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/tickets/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          senderType: 'admin',
          senderName: adminName,
          senderEmail: 'admin@scythcode.com',
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

  const updateTicketStatus = async (status: string) => {
    if (!selectedTicket) return;

    try {
      const response = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          status,
          closedBy: adminName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTickets();
        setSelectedTicket({ ...selectedTicket, status });
        fetchMessages();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Tickets</h2>
            <p className="text-gray-300">Sign in to manage support tickets</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    open: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
    'in-progress': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertCircle },
    resolved: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
    closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: XCircle },
  };

  const priorityColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  const stats = [
    { label: 'Total', value: tickets.length, color: 'from-cyan-500 to-blue-600' },
    { label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: 'from-blue-500 to-blue-600' },
    { label: 'In Progress', value: tickets.filter((t) => t.status === 'in-progress').length, color: 'from-yellow-500 to-orange-600' },
    { label: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Tickets Dashboard</h1>
                <p className="text-gray-400">Welcome back, {adminName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
            <div className="bg-gray-900/50 border-b border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white mb-4">Tickets</h2>
              
              {/* Search & Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto p-4 space-y-3">
              {filteredTickets.map((ticket) => {
                const StatusIcon = statusColors[ticket.status]?.icon || Clock;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-gray-900/50 border-gray-700 hover:bg-gray-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-cyan-400 font-mono text-sm">{ticket.ticket_number}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusColors[ticket.status]?.bg
                        } ${statusColors[ticket.status]?.text} flex items-center gap-1`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {ticket.status}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{ticket.subject}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ticket.user_name}
                      </span>
                      <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Detail */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
            {selectedTicket ? (
              <>
                <div className="bg-gray-900/50 border-b border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className="text-cyan-400 font-mono text-sm">{selectedTicket.ticket_number}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{selectedTicket.subject}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {['in-progress', 'resolved', 'closed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateTicketStatus(status)}
                        disabled={selectedTicket.status === status}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedTicket.status === status
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        Mark as {status.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">User</p>
                      <p className="text-white">{selectedTicket.user_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white text-xs">{selectedTicket.user_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Priority</p>
                      <p className={priorityColors[selectedTicket.priority]}>{selectedTicket.priority}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-white">{selectedTicket.category}</p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender_type === 'system' ? (
                        <div className="bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300 text-center">
                          {msg.message}
                        </div>
                      ) : (
                        <div className={`max-w-[80%] ${msg.sender_type === 'admin' ? 'bg-green-600' : 'bg-cyan-600'} text-white px-4 py-2 rounded-xl`}>
                          <p className="text-xs font-semibold mb-1">{msg.sender_name}</p>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900/50 border-t border-gray-700 p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      disabled={isSending || selectedTicket.status === 'closed'}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending || selectedTicket.status === 'closed'}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-xl disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
