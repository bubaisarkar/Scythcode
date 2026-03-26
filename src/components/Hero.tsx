'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Globe, Star, Code, Rocket } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden pt-16 sm:pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 gradient-bg-1 rounded-full opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 gradient-bg-2 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-2 sm:w-4 h-2 sm:h-4 bg-cyan-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/4 w-3 sm:w-6 h-3 sm:h-6 bg-pink-400 rounded-full opacity-40"
        />
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-6xl relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>Professional Web Development</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block mb-2">
              Transform Ideas Into
            </span>
            <span className="text-white">
              Digital Reality
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            From Discord bots to enterprise applications, we deliver cutting-edge solutions 
            that scale with your business. Professional development starting at just $11.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto gradient-bg-1 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center space-x-2"
            >
              <Rocket className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Start Your Project</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto border-2 border-cyan-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300"
            >
              Learn More About Us
            </motion.button>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-center"
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full gradient-bg-3 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-gray-300">Optimized for speed and performance</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-center"
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full gradient-bg-4 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Fully Responsive</h3>
              <p className="text-sm sm:text-base text-gray-300">Perfect on all devices and screens</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1"
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full gradient-bg-2 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Code className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Modern Tech</h3>
              <p className="text-sm sm:text-base text-gray-300">Built with latest technologies</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;