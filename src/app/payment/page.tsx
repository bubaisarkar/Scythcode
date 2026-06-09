'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Coins, Check, Shield, Zap, Star, Gift, ArrowRight, Lock } from 'lucide-react';

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  popular?: boolean;
  bonus?: number;
  badge?: string;
}

export default function PaymentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const packages: CoinPackage[] = [
    { id: 'starter', coins: 1500, price: 11 },
    { id: 'basic', coins: 2500, price: 22, bonus: 100 },
    { id: 'popular', coins: 3600, price: 33, popular: true, bonus: 300, badge: 'MOST POPULAR' },
    { id: 'premium', coins: 4700, price: 44, bonus: 500 },
    { id: 'pro', coins: 5800, price: 55, bonus: 800, badge: 'BEST VALUE' },
    { id: 'elite', coins: 9300, price: 88, bonus: 1500 },
    { id: 'mega', coins: 22000, price: 200, bonus: 4000, badge: 'ULTIMATE' },
  ];

  const handlePayment = async (pkg: CoinPackage) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    setSelectedPackage(pkg);
    setIsProcessing(true);

    try {
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pkg.price * 100,
          currency: 'USD',
          packageId: pkg.id,
          coins: pkg.coins,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Scythcode',
        description: `${pkg.coins} Coins Package`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.uid,
              coins: pkg.coins,
              packageId: pkg.id,
              userEmail: user.email,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            setShowSuccess(true);
            setTimeout(() => router.push('/dashboard'), 3000);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: user.displayName || '', email: user.email || '' },
        theme: { color: '#0EA5E9' },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setSelectedPackage(null);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (showSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="max-w-md w-full"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-12 text-center shadow-2xl">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Success!</h2>
              <div className="text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3">
                +{selectedPackage?.coins.toLocaleString()}
              </div>
              <p className="text-slate-400 text-lg">Coins added to your wallet</p>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0F172A] pt-24 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="inline-block mb-6"
            >
              <Coins className="w-20 h-20 text-yellow-400" />
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6">
              Buy Coins
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Select your package and power up your projects instantly
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">256-bit Encrypted</span>
              </div>
            </div>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group"
              >
                <div
                  onClick={() => handlePayment(pkg)}
                  className={`relative h-full bg-gradient-to-br cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 ${
                    pkg.popular
                      ? 'from-cyan-900/50 to-blue-900/50 border-cyan-500 shadow-xl shadow-cyan-500/20'
                      : 'from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300'
                      }`}>
                        {pkg.badge}
                      </div>
                    </div>
                  )}

                  {/* Coin Icon */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
                        pkg.popular
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                          : 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500'
                      }`}
                    >
                      <Coins className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  {/* Coins Amount */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-white mb-2">
                      {pkg.coins.toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-sm font-semibold tracking-wider">COINS</div>
                    
                    {/* Bonus */}
                    {pkg.bonus && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="inline-flex items-center gap-1.5 mt-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-bold"
                      >
                        <Gift className="w-4 h-4" />
                        +{pkg.bonus} Bonus
                      </motion.div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl text-slate-500 font-bold">$</span>
                      <span className="text-6xl font-black text-white">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="text-slate-500 text-sm">one-time payment</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {['Instant delivery', 'Never expires', 'Full access'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                        </div>
                        <span className="text-slate-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePayment(pkg); }}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg group-hover:shadow-xl flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/50'
                        : 'bg-white hover:bg-slate-100 text-slate-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing && selectedPackage?.id === pkg.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Buy Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Shield, title: 'Secure & Protected', desc: 'Bank-level security powered by Razorpay', color: 'from-emerald-500 to-green-600' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Coins credited instantly to your account', color: 'from-cyan-500 to-blue-600' },
              { icon: Star, title: 'Premium Quality', desc: 'Best value packages with bonus rewards', color: 'from-yellow-500 to-orange-500' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <p className="text-slate-500">
              🔒 Powered by <span className="text-cyan-400 font-semibold">Razorpay</span> • All transactions are secure
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
