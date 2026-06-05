'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '50',
      description: 'Perfect for small projects and MVPs',
      features: [
        'Modern responsive design',
        'Up to 5 pages',
        'Mobile optimization',
        'Basic SEO setup',
        'Contact form integration',
        '2 weeks delivery'
      ]
    },
    {
      name: 'Professional',
      price: '200',
      description: 'Ideal for growing businesses',
      popular: true,
      features: [
        'Everything in Starter',
        'Custom functionality',
        'Database integration',
        'User authentication',
        'API development',
        'Admin dashboard',
        '4 weeks delivery',
        'Priority support'
      ]
    },
    {
      name: 'Business',
      price: '500',
      description: 'For established companies',
      features: [
        'Everything in Professional',
        'Advanced features',
        'Payment processing',
        'Third-party integrations',
        'Cloud deployment',
        'Performance optimization',
        '6-8 weeks delivery',
        'Dedicated support'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large organizations',
      features: [
        'Custom architecture',
        'Scalable infrastructure',
        'Advanced security',
        'Microservices',
        'DevOps & CI/CD',
        'Team collaboration',
        'Flexible timeline',
        '24/7 support'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400"
          >
            Choose the plan that fits your needs. All plans include free consultation and ongoing support.
          </motion.p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10' 
                    : 'border border-gray-700/50 hover:border-gray-600'
                }`}>
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      {plan.price !== 'Custom' && (
                        <span className="text-gray-400 text-xl mr-1">$</span>
                      )}
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      {plan.price !== 'Custom' && (
                        <span className="text-gray-400 text-xl ml-1">+</span>
                      )}
                    </div>
                    {plan.price !== 'Custom' && (
                      <p className="text-sm text-gray-500 mt-1">starting price</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a
                    href="/start-project"
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="inline-block w-4 h-4 ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400">
            All plans include free consultation. Need something custom?{' '}
            <a href="#contact" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;