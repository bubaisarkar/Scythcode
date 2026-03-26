'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Rocket } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img 
                src="/icon.png" 
                alt="Medusa" 
                className="w-10 h-10 rounded-full"
              />
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 text-white`}>
              Medusa
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors duration-300 font-medium px-3 py-2 rounded-lg text-white hover:text-cyan-400 hover:bg-white/10`}
              >
                {item.name}
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg-1 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 hover:bg-white/10`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 transition-colors duration-300 text-white`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-300 text-white`} />
              )}
            </button>

            {/* Mobile menu */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-full left-0 right-0 shadow-xl border-t mt-1 bg-gradient-to-r from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-md border-gray-700`}
              >
                <nav className="p-4 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 transition-all duration-300 font-medium rounded-lg text-white hover:text-cyan-400 hover:bg-white/10`}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full gradient-bg-1 text-white px-6 py-3 rounded-full font-semibold"
                    >
                      Get Started
                    </button>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;