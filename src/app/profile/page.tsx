'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  LogOut,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Globe,
  Smartphone
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
    if (user) {
      setDisplayName(user.displayName || '');
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

  const handleSaveProfile = () => {
    // Here you would typically update the user profile via API
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const formatDate = (timestamp: string | number | undefined) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const accountInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: user.email || 'Not provided',
      verified: user.emailVerified,
      color: 'text-cyan-400'
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: formatDate(user.metadata?.creationTime),
      color: 'text-purple-400'
    },
    {
      icon: Shield,
      label: 'Account Status',
      value: 'Active',
      verified: true,
      color: 'text-green-400'
    },
    {
      icon: Key,
      label: 'Authentication',
      value: user.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'GitHub',
      color: 'text-orange-400'
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400 text-lg">Manage your account settings and preferences</p>
          </motion.div>

          {/* Success Message */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-green-500/20 border border-green-500 text-green-200 px-6 py-4 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Profile updated successfully!</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-24">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="relative inline-block mb-4">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-32 h-32 rounded-full border-4 border-gray-700"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border-4 border-gray-700">
                        <span className="text-white text-4xl font-bold">
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-800 hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* User Info */}
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>

                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <CheckCircle className="w-4 h-4" />
                    <span>Active Account</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-cyan-400">0</div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">0</div>
                      <div className="text-xs text-gray-400">Messages</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">0</div>
                      <div className="text-xs text-gray-400">Reviews</div>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Settings Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white">Account Information</h3>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accountInfo.map((info, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${info.color} mt-1`}>
                          <info.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-400 mb-1">{info.label}</div>
                          <div className="text-white font-medium flex items-center gap-2">
                            <span className="truncate">{info.value}</span>
                            {info.verified && (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-700"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                          placeholder="Enter your display name"
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Notification Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium mb-1">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive email updates about your account</div>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        emailNotifications ? 'bg-cyan-500' : 'bg-gray-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: emailNotifications ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-6 h-6 bg-white rounded-full mt-1"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium mb-1">Project Updates</div>
                      <div className="text-sm text-gray-400">Get notified about project progress</div>
                    </div>
                    <button
                      onClick={() => setProjectUpdates(!projectUpdates)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        projectUpdates ? 'bg-cyan-500' : 'bg-gray-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: projectUpdates ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-6 h-6 bg-white rounded-full mt-1"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium mb-1">Marketing Emails</div>
                      <div className="text-sm text-gray-400">Receive updates about new services and offers</div>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        marketingEmails ? 'bg-cyan-500' : 'bg-gray-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: marketingEmails ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-6 h-6 bg-white rounded-full mt-1"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">Security</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="text-white font-medium">Account Protected</div>
                        <div className="text-sm text-gray-400">
                          Your account is secured with {user.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'GitHub'} authentication
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-white font-medium">Login Provider</div>
                          <div className="text-sm text-gray-400">
                            {user.providerData?.[0]?.providerId === 'google.com' ? 'Google OAuth' : 'GitHub OAuth'}
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-2xl font-bold text-white">Danger Zone</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
