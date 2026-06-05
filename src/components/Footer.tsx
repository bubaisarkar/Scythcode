'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Code2, Sparkles, Zap } from 'lucide-react';

const Footer = () => {
  const services = [
    'Web Applications',
    'Database Solutions',
    'Authentication Systems',
    'API Development',
    'E-commerce',
    'Enterprise Solutions'
  ];

  const quickLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', 
      label: 'Facebook', 
      gradient: 'from-blue-600 to-blue-700' 
    },
    { 
      icon: Twitter, 
      href: process.env.NEXT_PUBLIC_TWITTER_URL || '#', 
      label: 'Twitter', 
      gradient: 'from-sky-500 to-sky-600' 
    },
    { 
      icon: Instagram, 
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', 
      label: 'Instagram', 
      gradient: 'from-pink-500 to-purple-600' 
    },
    { 
      icon: Linkedin, 
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', 
      label: 'LinkedIn', 
      gradient: 'from-blue-700 to-blue-800' 
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Company Info - Takes more space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
              >
                <Code2 className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Scythcode
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-lg max-w-md">
              Transforming ideas into powerful digital solutions. Professional web development with cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 bg-gradient-to-br ${social.gradient} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Services</h3>
            </div>
            <ul className="space-y-2">
              {services.map((service) => (
                <motion.li 
                  key={service}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{service}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Quick Links</h3>
            </div>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-white">Contact</h3>
            </div>
            <div className="space-y-3">
              <motion.a
                href="mailto:dantethedev@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3 text-gray-400 hover:text-pink-400 transition-colors duration-300 group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm break-all">dantethedev@gmail.com</span>
              </motion.a>
              <motion.a
                href="mailto:drancarnox6@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3 text-gray-400 hover:text-pink-400 transition-colors duration-300 group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm break-all">drancarnox6@gmail.com</span>
              </motion.a>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3 text-gray-400 group"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-pink-400" />
                <span className="text-sm">Remote Worldwide</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {legalLinks.map((link, index) => (
              <span key={link.name} className="flex items-center">
                <motion.a
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  {link.name}
                </motion.a>
                {index < legalLinks.length - 1 && (
                  <span className="mx-3 text-gray-700">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Copyright & Scroll Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-center sm:text-left mb-4 sm:mb-0">
              © 2026 Scythcode. All rights reserved.
            </p>
            
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;