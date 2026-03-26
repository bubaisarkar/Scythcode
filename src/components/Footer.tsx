'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Rocket, ArrowUp } from 'lucide-react';

const Footer = () => {
  const services = [
    'Discord Bots',
    'Web Scraping',
    'Automation Scripts',
    'WordPress Sites',
    'Shopify Stores',
    'Custom Development'
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center">
                <img 
                  src="/icon.png" 
                  alt="Medusa" 
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">Medusa</span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Professional web development services tailored to your needs. From simple bots to complex custom applications.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 sm:w-10 h-8 sm:h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300`}
                  aria-label={social.label}
                >
                  <social.icon className="w-3 sm:w-4 h-3 sm:h-4" />
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
          >
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Our Services</h3>
            <ul className="space-y-1 sm:space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:dantethedev@gmail.com"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base break-all"
                >
                  dantethedev@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">Remote Worldwide</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-700 mt-6 sm:mt-8"
        >
          <p className="text-gray-400 text-center sm:text-left mb-4 sm:mb-0 text-sm sm:text-base">
            All rights are reserved with Medusa @2026
          </p>
          
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 sm:w-12 h-10 sm:h-12 gradient-bg-1 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;