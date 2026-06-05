'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, Globe, ShoppingCart, Code2, Database, Smartphone, 
  Palette, Search, Mail, MessageSquare, ArrowRight, CheckCircle
} from 'lucide-react';

interface Service {
  id: string;
  icon: any;
  title: string;
  description: string;
  startingPrice: number;
  popular?: boolean;
}

const StartProject = () => {
  const router = useRouter();

  const services: Service[] = [
    {
      id: 'discord-bot',
      icon: Bot,
      title: 'Discord Bot',
      description: 'Custom bots with moderation, commands, and integrations',
      startingPrice: 11,
    },
    {
      id: 'website',
      icon: Globe,
      title: 'Website',
      description: 'Responsive websites with modern design and SEO',
      startingPrice: 22,
      popular: true,
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Online stores with payment and inventory systems',
      startingPrice: 33,
    },
    {
      id: 'web-app',
      icon: Code2,
      title: 'Web App',
      description: 'Custom applications with complex functionality',
      startingPrice: 88,
      popular: true,
    },
    {
      id: 'mobile-app',
      icon: Smartphone,
      title: 'Mobile App',
      description: 'iOS and Android apps with native features',
      startingPrice: 150,
    },
    {
      id: 'api',
      icon: Database,
      title: 'API Development',
      description: 'RESTful APIs with secure authentication',
      startingPrice: 44,
    },
    {
      id: 'ui-ux',
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful interfaces with user research',
      startingPrice: 55,
    },
    {
      id: 'seo',
      icon: Search,
      title: 'SEO',
      description: 'Improve rankings with technical optimization',
      startingPrice: 33,
    },
    {
      id: 'automation',
      icon: Code2,
      title: 'Automation',
      description: 'Scripts for web scraping and task automation',
      startingPrice: 22,
    },
    {
      id: 'email-system',
      icon: Mail,
      title: 'Email System',
      description: 'Templates and automation for campaigns',
      startingPrice: 16,
    },
    {
      id: 'chat-system',
      icon: MessageSquare,
      title: 'Chat System',
      description: 'Real-time messaging with notifications',
      startingPrice: 66,
    },
    {
      id: 'custom',
      icon: Code2,
      title: 'Custom Project',
      description: 'Something unique? Let\'s discuss your needs',
      startingPrice: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What do you need built?
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose a service to get started. Fixed pricing, no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => router.push(`/start-project/${service.id}`)}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all relative group border border-gray-100"
            >
              {service.popular && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🔥 Popular
                </span>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-blue-600">
                      {service.startingPrice === 0 ? 'Custom' : `$${service.startingPrice}`}
                    </span>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-3">
            Not sure what you need?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
            Chat with us to discuss your project and get a custom quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/live-chat')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Live Chat
            </button>
            <button
              onClick={() => router.push('/#contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors border-2 border-blue-400"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartProject;
