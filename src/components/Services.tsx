'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Shield, Zap, Globe, Sparkles, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>What We Do</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional development services tailored to your needs
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Large Feature - Web Applications */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Code2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Web Applications</h3>
                <p className="text-gray-400 text-lg mb-6">
                  Custom web apps built with Next.js, React, and modern frameworks. Responsive, fast, and scalable solutions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm">Next.js</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm">Tailwind</span>
                </div>
                <a href="/start-project" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Database Solutions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-6 hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Database Solutions</h3>
              <p className="text-gray-400 text-sm mb-4">Secure and scalable database architecture</p>
              <a href="/start-project" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Authentication */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6 hover:border-green-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Authentication</h3>
              <p className="text-gray-400 text-sm mb-4">OAuth 2.0 and secure auth systems</p>
              <a href="/start-project" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* E-commerce */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl p-6 hover:border-orange-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">E-commerce Platforms</h3>
              <p className="text-gray-400 text-sm mb-4">Complete online stores with payment gateways and inventory management</p>
              <a href="/start-project" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* API Development */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">API Development</h3>
              <p className="text-gray-400 text-sm mb-4">RESTful and GraphQL APIs</p>
              <a href="/start-project" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Enterprise Solutions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 hover:border-indigo-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Solutions</h3>
              <p className="text-gray-400 text-sm mb-4">Scalable systems for businesses</p>
              <a href="/start-project" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-gray-700/50 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Every project is unique. Let's discuss your specific requirements and build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/start-project"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contact"
                className="bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;