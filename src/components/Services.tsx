'use client';

import { motion } from 'framer-motion';
import { Bot, Globe, ShoppingCart, Code2, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Bot,
      title: 'Automation & Bots',
      description: 'Custom Discord bots, web scrapers, and automation scripts to streamline your workflow.',
      features: ['Discord Bot Development', 'Web Scraping Tools', 'Process Automation', 'API Integrations'],
      gradient: 'gradient-bg-1',
      price: '$11',
      accent: 'text-blue-400'
    },
    {
      icon: Globe,
      title: 'WordPress Solutions',
      description: 'Professional WordPress websites with custom themes and functionality.',
      features: ['Custom WordPress Sites', 'Theme Development', 'Plugin Integration', 'SEO Optimization'],
      gradient: 'gradient-bg-2',
      price: '$22',
      accent: 'text-pink-400'
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Stores',
      description: 'Complete online stores on Shopify, WooCommerce, and other platforms.',
      features: ['Shopify Development', 'WooCommerce Setup', 'Payment Integration', 'Inventory Management'],
      gradient: 'gradient-bg-3',
      price: '$33',
      accent: 'text-cyan-400'
    },
    {
      icon: Code2,
      title: 'Custom Development',
      description: 'Full-stack applications built with modern technologies like Next.js and React.',
      features: ['Next.js Applications', 'React Development', 'Database Design', 'Cloud Deployment'],
      gradient: 'gradient-bg-4',
      price: '$88',
      accent: 'text-green-400'
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Zap className="w-3 sm:w-4 h-3 sm:h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              What We Build
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            From simple automation to complex enterprise solutions, we deliver 
            exceptional digital experiences that drive results.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 ${service.gradient} rounded-2xl flex items-center justify-center`}>
                    <service.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{service.title}</h3>
                    <div className={`inline-flex items-center bg-green-500/20 border border-green-400/30 ${service.accent} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold mt-1`}>
                      Starting at {service.price}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {service.description}
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${service.gradient} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="gradient-bg-1 rounded-2xl text-white shadow-2xl p-8 sm:p-12 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <Users className="w-10 sm:w-12 h-10 sm:h-12" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80 text-sm sm:text-base">Happy Clients</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <Zap className="w-10 sm:w-12 h-10 sm:h-12" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">1000+</div>
              <div className="text-white/80 text-sm sm:text-base">Projects</div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <Globe className="w-10 sm:w-12 h-10 sm:h-12" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80 text-sm sm:text-base">Support</div>
            </div>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Your Project?</h3>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join hundreds of satisfied clients who trust us with their digital transformation.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Get Free Consultation</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;