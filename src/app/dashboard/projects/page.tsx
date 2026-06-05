'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  Filter,
  Search,
  Eye,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  // Sample projects data - in real app, this would come from an API
  const projects = [
    // Empty for now - user has no projects yet
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    completed: 'bg-green-500/20 border-green-500/30 text-green-400',
    pending: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    cancelled: 'bg-red-500/20 border-red-500/30 text-red-400'
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Projects</h1>
                <p className="text-gray-400 text-lg">View and manage all your projects</p>
              </div>
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <Plus className="w-5 h-5" />
                New Project
              </Link>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
                <button className="inline-flex items-center gap-2 bg-gray-900/50 border border-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>
          </motion.div>

          {/* Projects List */}
          {projects.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Projects Yet</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Start your first project to see it here. We'll help you bring your ideas to life!
                </p>
                <Link
                  href="/start-project"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  <Plus className="w-6 h-6" />
                  Start Your First Project
                </Link>
              </div>
            </motion.div>
          ) : (
            // Projects Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300 group"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-lg border text-sm font-medium ${statusColors[project.status]}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Project Info */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Started {project.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>{project.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                    <button className="flex-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button className="bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg hover:bg-gray-900 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
                  <p className="text-gray-400">Our team is here to assist you with your projects.</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href="/live-chat"
                    className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-6 py-3 rounded-xl font-semibold hover:bg-purple-500/30 transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Live Chat
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
