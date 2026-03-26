'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageCircle, Clock, User, Briefcase } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'dantethedev@gmail.com',
      description: 'Send us an email anytime',
      gradient: 'gradient-bg-1',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Remote Worldwide',
      description: 'We work with clients globally',
      gradient: 'gradient-bg-3',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let&apos;s Start Building
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            Ready to transform your ideas into reality? Contact us today and let&apos;s discuss 
            how we can bring your digital vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl"
          >
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 sm:w-16 h-12 sm:h-16 gradient-bg-1 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Send className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Send us a message</h3>
                <p className="text-gray-300 text-sm sm:text-base">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>
              
              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500 text-sm sm:text-base"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                        <User className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500 text-sm sm:text-base"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                        <User className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500 text-sm sm:text-base"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                      <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Service Interested In
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500 appearance-none cursor-pointer text-sm sm:text-base" defaultValue="">
                      <option value="" disabled className="text-gray-400">Select a service</option>
                      <option value="starter" className="bg-gray-800 text-white">Starter Package ($11)</option>
                      <option value="professional" className="bg-gray-800 text-white">Professional Package ($22)</option>
                      <option value="business" className="bg-gray-800 text-white">Business Package ($33)</option>
                      <option value="enterprise" className="bg-gray-800 text-white">Enterprise Package ($88)</option>
                      <option value="custom" className="bg-gray-800 text-white">Custom Solution</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                      <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500 resize-vertical min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full gradient-bg-1 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 group"
                  >
                    <Send className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Send Message</span>
                  </motion.button>
                </div>
                
                {/* Additional Info */}
                <div className="pt-3 sm:pt-4 border-t border-gray-700">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span>Quick Response</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span>Free Consultation</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Information</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                We&apos;re here to help you succeed. Reach out to us through any of these channels 
                and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 ${info.gradient} rounded-xl flex items-center justify-center`}>
                        <info.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg text-white">{info.title}</h4>
                        <p className="text-lg sm:text-xl font-medium text-cyan-400">{info.content}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{info.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                  <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400" />
                  <h4 className="font-semibold text-base sm:text-lg text-white">Quick Response</h4>
                </div>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  We typically respond to all inquiries within 2-4 hours during business hours. 
                  For urgent matters, please call us directly.
                </p>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                  <span className="text-xs sm:text-sm text-gray-400">
                    Business Hours: Monday - Friday, 8:00 AM - 6:00 PM EST
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;