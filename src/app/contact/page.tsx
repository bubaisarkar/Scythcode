'use client';

import Contact from '@/components/Contact';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'dantethedev@gmail.com',
      description: 'Send us an email anytime',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Remote Worldwide',
      description: 'We work with clients globally',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: '24/7 Available',
      description: 'Round the clock support',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Phone,
      title: 'Response Time',
      content: 'Within 24 Hours',
      description: 'Quick response guaranteed',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const reasons = [
    {
      icon: MessageSquare,
      title: 'Free Consultation',
      description: 'Get expert advice on your project at no cost'
    },
    {
      icon: Send,
      title: 'Quick Response',
      description: 'We respond to all inquiries within 24 hours'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Book a call at a time that works for you'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white block mb-2">Let's Build</span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Something Amazing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
              Have a project in mind? We'd love to hear about it. Get in touch and let's 
              discuss how we can help bring your vision to life.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                <p className="text-cyan-400 font-semibold mb-1">{info.content}</p>
                <p className="text-sm text-gray-400">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Reach Out?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We're here to help you succeed
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 text-center hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-400">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Contact />
        </div>
      </section>

      {/* Additional CTA */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-gray-700/50 rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prefer to Start Right Away?
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Skip the form and jump straight into our project request system
              </p>
              <a
                href="/start-project"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <span>Start Your Project</span>
                <Send className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
