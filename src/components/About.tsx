'use client';

import { motion } from 'framer-motion';
import { Award, Users, Target, Zap, Code, Rocket, ArrowRight, Sparkles } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Clients', color: 'text-cyan-400' },
    { number: '1000+', label: 'Projects', color: 'text-purple-400' },
    { number: '5+', label: 'Years', color: 'text-green-400' },
    { number: '24/7', label: 'Support', color: 'text-orange-400' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance and quick turnaround times',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Maintainable, scalable, and well-documented',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'Goal Oriented',
      description: 'Focused on delivering results that matter',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Rigorous testing and quality control',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Building Digital Excellence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We transform ideas into powerful digital solutions with cutting-edge technology and creative expertise
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
              <Rocket className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Empowering businesses through technology
            </h3>
            
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                At Scythcode, we're passionate about creating digital solutions that make a real impact. 
                Our team of expert developers combines technical excellence with creative problem-solving 
                to deliver projects that exceed expectations.
              </p>
              <p>
                From startups to enterprises, we've helped hundreds of clients transform their ideas into 
                successful digital products. We don't just write code – we build partnerships and create 
                solutions that drive growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/start-project"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </motion.div>

          {/* Right Side - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Technologies We Use
            </h3>
            <p className="text-gray-400">
              We work with cutting-edge technologies to deliver modern, scalable solutions
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Next.js', icon: '⚡' },
              { name: 'React', icon: '⚛️' },
              { name: 'JavaScript', icon: '💛' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Python', icon: '🐍' },
              { name: 'PHP', icon: '🐘' },
              { name: 'C#', icon: '💜' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'Rust', icon: '🦀' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'SQLite', icon: '💾' },
              { name: 'REST', icon: '🔌' },
              { name: 'GraphQL', icon: '◆' },
              { name: 'Nginx', icon: '🌐' },
              { name: 'AWS', icon: '☁️' },
              { name: 'Docker', icon: '🐳' },
              { name: 'Tailwind', icon: '🎨' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
      </div>
    </section>
  );
};

export default About;