'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$11',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
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
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
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
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false,
      description: 'Complete e-commerce solutions for your online store',
      features: [
        'Shopify Store Setup',
        'WooCommerce Development',
        'Wix E-commerce',
        'Payment Gateway Integration',
        'Product Management',
        'Inventory System',
        '5 Revisions Included',
        '14-Day Delivery'
      ]
    },
    {
      name: 'Enterprise',
      price: '$88',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="pricing" className="py-20 bg-gray-50">
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
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect package for your project. All plans include professional development, 
            testing, and deployment.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative ${plan.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.borderColor} ${
                plan.popular ? 'ring-4 ring-green-200' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                >
                  Most Popular
                </motion.div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/ project</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow duration-300`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Something Custom?</h3>
            <p className="text-gray-600 mb-6">
              Have a unique project that doesn&apos;t fit our standard packages? We offer custom solutions 
              tailored to your specific requirements. Contact us for a personalized quote.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow duration-300"
            >
              Contact for Custom Quote
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;