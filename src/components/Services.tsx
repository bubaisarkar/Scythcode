'use client';

import { motion } from 'framer-motion';
import { Bot, Globe, ShoppingCart, Code2, Zap, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Bot,
      title: 'Discord Bots & Automation',
      description: 'Custom Discord bots, web scrapers, and automation scripts to streamline your workflow.',
      features: ['Custom Discord Bots', 'Web Scraping Tools', 'Automation Scripts', 'API Integrations'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Globe,
      title: 'WordPress Development',
      description: 'Professional WordPress websites with custom themes and functionality tailored to your needs.',
      features: ['Custom WordPress Sites', 'Theme Modifications', 'Plugin Development', 'SEO Optimization'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Solutions',
      description: 'Complete e-commerce stores on Wix, Shopify, and WooCommerce platforms.',
      features: ['Shopify Stores', 'WooCommerce Sites', 'Wix E-commerce', 'Payment Integration'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Code2,
      title: 'Custom Development',
      description: 'Fully custom web applications built with Next.js, React.js, and modern technologies.',
      features: ['Next.js Applications', 'React.js Development', 'Custom UI/UX', 'Performance Optimization'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive web development solutions to bring your digital vision to life. 
            From simple automation to complex custom applications.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`${service.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center mb-6">
                <div className={`bg-gradient-to-r ${service.color} p-3 rounded-xl`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold ml-4 text-gray-800">{service.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-6 bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow duration-300`}
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-3xl font-bold mb-2">500+</h4>
                <p className="text-blue-100">Happy Clients</p>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-3xl font-bold mb-2">1000+</h4>
                <p className="text-blue-100">Projects Completed</p>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-3xl font-bold mb-2">24/7</h4>
                <p className="text-blue-100">Support Available</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;