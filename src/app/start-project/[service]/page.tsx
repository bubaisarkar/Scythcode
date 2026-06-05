'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Send, MessageSquare, CheckCircle, AlertCircle, 
  Loader2, Clock, Shield, Zap, Star
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryDays: number;
}

const serviceData: Record<string, any> = {
  'discord-bot': {
    title: 'Discord Bot Development',
    subtitle: 'Custom bots for your Discord server',
    packages: [
      {
        id: 'basic',
        name: 'Basic',
        price: 11,
        description: 'Perfect for small servers',
        features: ['5 custom commands', 'Basic moderation', 'Simple responses', '7 days support'],
        deliveryDays: 3,
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 22,
        description: 'Most popular choice',
        features: ['15 custom commands', 'Advanced moderation', 'Database integration', 'Custom features', '30 days support'],
        deliveryDays: 5,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 44,
        description: 'For large communities',
        features: ['Unlimited commands', 'Full moderation suite', 'Database + API', 'Music player', 'Dashboard', '90 days support'],
        deliveryDays: 10,
      },
    ],
    questions: [
      { id: 'features', label: 'What features do you need?', type: 'textarea', placeholder: 'Describe the features...' },
      { id: 'serverSize', label: 'Server size', type: 'select', options: ['Small (< 100)', 'Medium (100-1000)', 'Large (1000+)'] },
    ],
  },
  'website': {
    title: 'Website Development',
    subtitle: 'Modern, responsive websites',
    packages: [
      {
        id: 'basic',
        name: 'Landing Page',
        price: 22,
        description: 'Single page website',
        features: ['1-3 pages', 'Responsive design', 'Contact form', 'SEO basics'],
        deliveryDays: 3,
      },
      {
        id: 'standard',
        name: 'Business Site',
        price: 55,
        description: 'Multi-page website',
        features: ['5-10 pages', 'Custom design', 'CMS', 'SEO optimized', 'Forms'],
        deliveryDays: 7,
      },
      {
        id: 'premium',
        name: 'Advanced',
        price: 110,
        description: 'Full-featured website',
        features: ['Unlimited pages', 'Custom features', 'Advanced CMS', 'Blog', 'Analytics'],
        deliveryDays: 14,
      },
    ],
    questions: [
      { id: 'pages', label: 'How many pages?', type: 'select', options: ['1-3', '4-7', '8-15', '15+'] },
      { id: 'design', label: 'Do you have a design?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'features', label: 'Special features?', type: 'textarea', placeholder: 'Blog, gallery, etc...' },
    ],
  },
  'ecommerce': {
    title: 'E-commerce Store',
    subtitle: 'Online store with payments',
    packages: [
      {
        id: 'basic',
        name: 'Starter',
        price: 33,
        description: 'Small product catalog',
        features: ['Up to 50 products', 'Payment gateway', 'Basic inventory', 'Order management'],
        deliveryDays: 5,
      },
      {
        id: 'standard',
        name: 'Professional',
        price: 88,
        description: 'Growing business',
        features: ['Up to 500 products', 'Multiple payments', 'Advanced inventory', 'Customer accounts', 'Email automation'],
        deliveryDays: 10,
      },
      {
        id: 'premium',
        name: 'Enterprise',
        price: 200,
        description: 'Large scale store',
        features: ['Unlimited products', 'Multi-vendor', 'Analytics', 'Custom integrations', 'Marketing tools'],
        deliveryDays: 21,
      },
    ],
    questions: [
      { id: 'products', label: 'Number of products?', type: 'select', options: ['1-50', '51-200', '201-500', '500+'] },
      { id: 'platform', label: 'Platform preference?', type: 'select', options: ['Shopify', 'WooCommerce', 'Custom'] },
    ],
  },
  'web-app': {
    title: 'Web Application',
    subtitle: 'Custom web applications',
    packages: [
      {
        id: 'basic',
        name: 'Simple App',
        price: 88,
        description: 'Basic functionality',
        features: ['User authentication', 'Database', 'Responsive design', 'Basic features'],
        deliveryDays: 7,
      },
      {
        id: 'standard',
        name: 'Advanced App',
        price: 200,
        description: 'Complex features',
        features: ['API integration', 'Admin dashboard', 'Real-time updates', 'Cloud hosting'],
        deliveryDays: 14,
      },
      {
        id: 'premium',
        name: 'Enterprise',
        price: 500,
        description: 'Full-scale application',
        features: ['Custom architecture', 'Microservices', 'Advanced security', 'Scalable infrastructure'],
        deliveryDays: 30,
      },
    ],
    questions: [
      { id: 'purpose', label: 'App purpose?', type: 'textarea', placeholder: 'Describe your app...' },
      { id: 'users', label: 'Expected users?', type: 'select', options: ['1-100', '100-1000', '1000+'] },
    ],
  },
  'custom': {
    title: 'Custom Project',
    subtitle: 'Tell us what you need',
    packages: [
      {
        id: 'consultation',
        name: 'Free Consultation',
        price: 0,
        description: 'Discuss your project',
        features: ['Project discussion', 'Requirement analysis', 'Custom quote', 'Timeline estimate'],
        deliveryDays: 0,
      },
    ],
    questions: [
      { id: 'project', label: 'Describe your project', type: 'textarea', placeholder: 'Tell us about it...' },
      { id: 'budget', label: 'Budget range?', type: 'select', options: ['$50-$200', '$200-$500', '$500-$1000', '$1000+'] },
      { id: 'timeline', label: 'Timeline?', type: 'select', options: ['ASAP', '1-2 weeks', '2-4 weeks', 'Flexible'] },
    ],
  },
};

const ProjectDetails = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.service as string;
  const service = serviceData[serviceId] || serviceData['custom'];

  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (action: 'submit' | 'chat') => {
    if (!selectedPackage && action === 'submit') {
      setSubmitStatus({ type: 'error', message: 'Please select a package' });
      return;
    }

    if (action === 'chat') {
      router.push('/live-chat');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const selectedPkg = service.packages.find((p: Package) => p.id === selectedPackage);
      const response = await fetch('/api/project-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: serviceId,
          serviceTitle: service.title,
          package: selectedPkg?.name,
          packagePrice: selectedPkg?.price,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: 'Request submitted! We will contact you within 24 hours.' });
        setTimeout(() => router.push('/'), 3000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPkg = service.packages.find((p: Package) => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-6xl">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Services
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600">{service.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {service.packages.map((pkg: Package, idx: number) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                    } ${idx === 1 ? 'md:scale-105 md:shadow-lg' : ''}`}
                  >
                    {idx === 1 && (
                      <div className="text-center mb-3">
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                      </div>
                      {pkg.deliveryDays > 0 && (
                        <div className="mt-2 inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-1" />
                          {pkg.deliveryDays} days
                        </div>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why choose us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Fast delivery</h3>
                    <p className="text-sm text-gray-600">Quality work within flexible timeframes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Unlimited revisions</h3>
                    <p className="text-sm text-gray-600">We work until you are satisfied</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">No hidden costs</h3>
                    <p className="text-sm text-gray-600">Pay exactly what you see, no surprises</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">24h response</h3>
                    <p className="text-sm text-gray-600">Quick replies to all inquiries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Your details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {service.questions?.map((q: any) => (
                  <div key={q.id}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{q.label}</label>
                    {q.type === 'textarea' ? (
                      <textarea
                        name={q.id}
                        value={formData[q.id] || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder={q.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    ) : q.type === 'select' ? (
                      <select
                        name={q.id}
                        value={formData[q.id] || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {q.options.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : q.type === 'radio' ? (
                      <div className="flex gap-4">
                        {q.options.map((opt: string) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={formData[q.id] === opt}
                              onChange={handleInputChange}
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}

                {selectedPkg && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Selected</p>
                        <p className="text-base font-bold text-gray-900">{selectedPkg.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-600 uppercase">Total</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {selectedPkg.price === 0 ? 'Free' : `$${selectedPkg.price}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus.type && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border-2 border-green-200' 
                      : 'bg-red-50 text-red-800 border-2 border-red-200'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <button
                  onClick={() => handleSubmit('submit')}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSubmit('chat')}
                  className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
