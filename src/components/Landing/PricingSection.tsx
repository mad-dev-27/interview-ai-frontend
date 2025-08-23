import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Crown, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { CustomPricingModal } from './CustomPricingModal';

export const PricingSection: React.FC = () => {
  const [showCustomModal, setShowCustomModal] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Try our platform with basic features',
      icon: Zap,
      features: [
        '1 interview session',
        'Basic performance analysis',
        'Limited feedback',
        'No detailed insights'
      ],
      limitations: [
        'No detailed analysis',
        'Basic scoring only',
        'Limited question variety'
      ],
      buttonText: 'Start Free',
      popular: false,
    },
    {
      name: 'Per Interview',
      price: '$150',
      description: 'Pay per interview with full features',
      icon: Crown,
      features: [
        'Detailed AI-powered insights',
        'Comprehensive performance tracking',
        'Advanced analytics dashboard',
        'Industry-specific questions',
        'Personalized improvement suggestions',
        'Video recording & playback',
        'Unlimited practice time'
      ],
      limitations: [],
      buttonText: 'Buy Interview',
      popular: true,
    },
    {
      name: 'Custom',
      price: 'Contact Us',
      description: 'Tailored solution for your needs',
      icon: Settings,
      features: [
        'Everything in Per Interview',
        'Bulk interview packages',
        'Team management',
        'Custom question sets',
        'Priority support',
        'Integration options',
        'Volume discounts'
      ],
      limitations: [],
      buttonText: 'Get Quote',
      popular: false,
    },
  ];

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Custom') {
      setShowCustomModal(true);
    } else {
      // Handle other plan selections
      console.log(`Selected plan: ${planName}`);
    }
  };

  return (
    <>
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the perfect plan for your interview preparation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 line-through">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlanSelect(plan.name)}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include secure payment processing and 24/7 support
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span>✓ Money-back guarantee</span>
              <span>✓ Secure payments</span>
              <span>✓ Instant access</span>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showCustomModal && (
          <CustomPricingModal onClose={() => setShowCustomModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};