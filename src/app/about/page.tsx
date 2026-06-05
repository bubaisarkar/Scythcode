'use client';

import { motion } from 'framer-motion';
import { Award, Users, Target, Zap, Code, Rocket, ArrowRight, Sparkles, Heart, Globe, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
      description: 'Optimized performance and quick turnaround times for all projects',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Maintainable, scalable, and well-documented codebase',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Target,
      title: 'Goal Oriented',
      description: 'Focused on delivering results that matter to your business',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Rigorous testing and quality control processes',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime guarantee',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      icon: Heart,
      title: 'Client Focused',
      description: 'Your success is our priority, always going the extra mile',
      gradient: 'from-pink-500 to-purple-500'
    }
  ];

  const values = [
    {
      icon: Globe,
      title: 'Innovation',
      description: 'We stay ahead of the curve, constantly exploring new technologies and methodologies to deliver cutting-edge solutions.',
      color: 'cyan'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in working closely with our clients, treating every project as a partnership built on trust and transparency.',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Excellence',
      description: 'We never settle for good enough. Every line of code, every design element is crafted with meticulous attention to detail.',
      color: 'green'
    }
  ];

  const team = [
    {
      role: 'Full-Stack Development',
      description: 'Expert developers proficient in modern frameworks and technologies',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      role: 'UI/UX Design',
      description: 'Creative designers crafting beautiful and intuitive interfaces',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      role: 'DevOps & Cloud',
      description: 'Infrastructure experts ensuring scalability and reliability',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      role: 'Quality Assurance',
      description: 'Dedicated QA team ensuring flawless user experiences',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>About Scythcode</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white block mb-2">We Build Digital</span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Experiences That Matter
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed">
              A passionate team of developers, designers, and innovators dedicated to transforming 
              your ideas into powerful digital solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/start-project"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-3xl p-8 md:p-12">
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
                    <div className={`text-4xl md:text-6xl font-bold ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Rocket className="w-4 h-4" />
                  <span>Our Story</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Empowering businesses through technology
                </h2>
                
                <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                  <p>
                    Founded with a vision to bridge the gap between innovative ideas and digital reality, 
                    Scythcode has grown into a trusted partner for businesses worldwide.
                  </p>
                  <p>
                    Our journey began with a simple belief: technology should empower, not complicate. 
                    Today, we've helped hundreds of clients transform their visions into successful 
                    digital products that drive real business growth.
                  </p>
                  <p>
                    From startups taking their first steps to enterprises scaling their operations, 
                    we bring the same level of dedication, expertise, and passion to every project.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
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
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-3xl p-8 h-full hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${value.color}-500 to-${value.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Expert Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Talented professionals dedicated to your success
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 h-full hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300">
                  <div className={`w-full h-32 bg-gradient-to-br ${member.gradient} rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Code className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{member.role}</h3>
                  <p className="text-sm text-gray-400">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-gray-700/50 rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Let's work together to bring your vision to life. Get in touch today and 
                discover how we can help your business thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
