'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$11',
      icon: Zap,
      gradient: 'gradient-bg-1',
      popular: false,
      description: 'Perfect for small automation tasks and simple bots',
      features: [
        'Discord Bot Development',
        'Basic Web Scraping',
        'Simple Automation Scripts',
        'API Integration',
        'Basic Support',
        '1 Revision Included',
        '7-Day Delivery'
      ]
    },
    {
      name: 'Professional',
      price: '$22',
      icon: Star,
      gradient: 'gradient-bg-2',
      popular: true,
      description: 'Ideal for custom WordPress sites and theme modifications',
      features: [
        'Custom WordPress Development',
        'Theme Customization',
        'Plugin Integration',
        'SEO Optimization',
        'Responsive Design',
        'Priority Support',
        '3 Revisions Included',
        '10-Day Delivery'
      ]
    },
    {
      name: 'Business',
      price: '$33',
      icon: Crown,
      gradient: 'gradient-bg-3',
      popular: false,
      description: 'Complete e-commerce solutions for your online store',
      features: [
        'Shopify Store Setup',
        'WooCommerce Development',
        'Payment Gateway Integration',
        'Product Management',
        'Inventory System',
        'Analytics Setup',
        '5 Revisions Included',
        '14-Day Delivery'
      ]
    },
    {
      name: 'Enterprise',
      price: '$88',
      icon: Rocket,
      gradient: 'gradient-bg-4',
      popular: false,
      description: 'Full-scale custom applications with Next.js and React',
      features: [
        'Custom Next.js Development',
        'React.js Applications',
        'Advanced UI/UX Design',
        'Database Integration',
        'Performance Optimization',
        'Dedicated Support',
        'Unlimited Revisions',
        '21-Day Delivery'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Crown className="w-3 sm:w-4 h-3 sm:h-4" />
            <span>Pricing Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            Choose the perfect package for your project. All plans include professional 
            development, testing, and deployment.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative p-6 sm:p-8 ${
                plan.popular ? 'ring-4 ring-cyan-400/50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-4 sm:mb-6">
                <div className={`w-12 sm:w-16 h-12 sm:h-16 ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <plan.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                  {plan.price}
                  <span className="text-sm sm:text-base text-gray-300 font-normal">/ project</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full ${plan.gradient} flex items-center justify-center`}>
                        <Check className="w-2 sm:w-3 h-2 sm:h-3 text-white" />
                      </div>
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full ${plan.gradient} text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center space-x-2`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Solution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-12 text-center"
        >
          <div className="w-16 h-16 gradient-bg-1 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Need Something Custom?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a unique project that doesn&apos;t fit our standard packages? We offer custom solutions 
            tailored to your specific requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg-1 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-2"
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-cyan-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-400 hover:text-gray-900 transition-colors duration-300"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center space-x-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 px-6 py-3 rounded-full">
            <Check className="w-6 h-6" />
            <span className="font-semibold">30-day money-back guarantee on all projects</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;