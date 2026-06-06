'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  FolderOpen,
  Calendar,
  Activity,
  ArrowRight,
  Plus,
  Rocket,
  Zap,
  Shield,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeProjects, setActiveProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);

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

  const stats = [
    {
      icon: FolderOpen,
      label: 'Active Projects',
      value: activeProjects.toString(),
      change: '+2 this month',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedProjects.toString(),
      change: 'All time',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: '0',
      change: 'Unread',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Activity,
      label: 'Activity',
      value: 'Active',
      change: 'Last login today',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  const recentActivity = [
    {
      icon: User,
      title: 'Account Created',
      description: 'Welcome to Scythcode! Your account has been successfully created.',
      time: 'Just now',
      color: 'text-green-400'
    },
    {
      icon: Shield,
      title: 'Account Secured',
      description: 'Your account is protected with Firebase authentication.',
      time: 'Just now',
      color: 'text-cyan-400'
    }
  ];

  const quickActions = [
    {
      icon: Rocket,
      title: 'Start New Project',
      description: 'Begin a new web development project',
      href: '/start-project',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Connect with our support team',
      href: '/live-chat',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: FileText,
      title: 'My Tickets',
      description: 'View and manage your support tickets',
      href: '/tickets',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: User,
      title: 'Edit Profile',
      description: 'Update your account settings',
      href: '/profile',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, {user.displayName || user.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-gray-400 text-lg">
                  Here's what's happening with your projects today.
                </p>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className="block bg-gray-900/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-400">{action.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <div className={`w-10 h-10 ${activity.color} bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white mb-1">{activity.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{activity.description}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Get Started Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to start your project?</h3>
                    <p className="text-gray-400">Let's bring your ideas to life with our professional web development services.</p>
                  </div>
                </div>
                <Link
                  href="/start-project"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap"
                >
                  <span>Start Project</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
