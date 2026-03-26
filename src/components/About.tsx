'use client';

import { motion } from 'framer-motion';
import { Award, Users, Clock, Target, CheckCircle, Star, Rocket } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, number: '500+', label: 'Happy Clients', gradient: 'gradient-bg-1' },
    { icon: CheckCircle, number: '1000+', label: 'Projects Completed', gradient: 'gradient-bg-2' },
    { icon: Award, number: '5+', label: 'Years Experience', gradient: 'gradient-bg-3' },
    { icon: Star, number: '4.9/5', label: 'Client Rating', gradient: 'gradient-bg-4' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'We never compromise on quality. Every project is built with attention to detail and best practices.',
      gradient: 'gradient-bg-1',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'We respect your time and deadlines. Our projects are delivered on schedule, every time.',
      gradient: 'gradient-bg-2',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our success. We work closely with you to understand and exceed your expectations.',
      gradient: 'gradient-bg-3',
    },
  ];

  const technologies = [
    { name: 'Next.js', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'WordPress', icon: '📝' },
    { name: 'Shopify', icon: '🛒' },
    { name: 'AWS', icon: '☁️' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            <span>About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet Medusa
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We&apos;re a team of passionate developers dedicated to creating exceptional digital experiences. 
            From simple automation to complex web applications, we bring your ideas to life.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6">
                <div className={`w-12 sm:w-16 h-12 sm:h-16 ${stat.gradient} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                  <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">{stat.number}</h3>
                <p className="text-gray-300 font-medium text-sm sm:text-base">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">Our Story</h3>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Founded with a mission to make professional web development accessible to everyone, 
                Medusa has grown from a small team of developers to a trusted partner for businesses 
                of all sizes.
              </p>
              <p>
                We believe that great software should be both powerful and user-friendly. That&apos;s why we 
                focus on creating solutions that not only meet your technical requirements but also 
                provide an exceptional user experience.
              </p>
              <p>
                Whether you need a simple Discord bot or a complex e-commerce platform, we have the 
                expertise and passion to bring your vision to life.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl"
          >
            <div className="p-8">
              <h4 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h4>
              <div className="space-y-4">
                {[
                  'Expert developers with 5+ years experience',
                  'Transparent pricing with no hidden costs',
                  'Fast turnaround times without compromising quality',
                  'Ongoing support and maintenance',
                  'Modern technologies and best practices',
                  '100% satisfaction guarantee'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-6">Technologies We Use</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            We work with cutting-edge technologies to deliver modern, scalable solutions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 hover:border-cyan-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-lg">{tech.icon}</span>
                <span className="text-gray-300">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-6">Our Values</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            These core values guide everything we do and ensure we deliver exceptional results for every client.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8">
                <div className={`w-12 sm:w-16 h-12 sm:h-16 ${value.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <value.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{value.title}</h4>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;