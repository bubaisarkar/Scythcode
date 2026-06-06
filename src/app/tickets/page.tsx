'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface TicketType {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter((t) => t.status === statusFilter));
    }
  }, [statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/tickets?userId=${user?.uid}`);
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
        setFilteredTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
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
    closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: XCircle },
  };

  const priorityColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };

  const stats = [
    { label: 'Total Tickets', value: tickets.length, color: 'from-cyan-500 to-blue-600' },
    { label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: 'from-blue-500 to-blue-600' },
    { label: 'In Progress', value: tickets.filter((t) => t.status === 'in-progress').length, color: 'from-yellow-500 to-orange-600' },
    { label: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Tickets</h1>
                <p className="text-gray-400 text-lg">View and manage your support tickets</p>
              </div>
              <Link
                href="/tickets/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Ticket
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              >
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tickets List */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Tickets Yet</h2>
                <p className="text-gray-400 text-lg mb-8">
                  {statusFilter === 'all'
                    ? "You haven't created any support tickets yet."
                    : `No ${statusFilter} tickets found.`}
                </p>
                <Link
                  href="/tickets/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  <Plus className="w-6 h-6" />
                  Create Your First Ticket
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket, index) => {
                const StatusIcon = statusColors[ticket.status]?.icon || Clock;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/tickets/${ticket.id}`}>
                      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-cyan-400 font-mono font-semibold">
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
                              <span className={`text-sm font-medium ${priorityColors[ticket.priority]}`}>
                                {ticket.priority.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{ticket.subject}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </span>
                              <span>{ticket.category}</span>
                            </div>
                          </div>
                          <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
