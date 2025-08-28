import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface PurchaseModalProps {
  onClose: () => void;
  onPurchase: (quantity: number, price: number) => void;
}

interface PricingTier {
  quantity: number;
  price: number;
  originalPrice: number;
  savings?: number;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    quantity: 1,
    price: 150,
    originalPrice: 150,
  },
  {
    quantity: 5,
    price: 700,
    originalPrice: 750,
    savings: 50,
    popular: true,
  },
  {
    quantity: 10,
    price: 1000,
    originalPrice: 1500,
    savings: 500,
  },
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose, onPurchase }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(pricingTiers[1]);

  const handlePurchase = () => {
    onPurchase(selectedTier.quantity, selectedTier.price);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Interviews
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.quantity}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                selectedTier.quantity === tier.quantity
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setSelectedTier(tier)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tier.popular && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedTier.quantity === tier.quantity
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedTier.quantity === tier.quantity && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tier.quantity} Interview{tier.quantity > 1 ? 's' : ''}
                    </h3>
                    {tier.savings && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Save ₹{tier.savings}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{tier.price}
                  </div>
                  {tier.savings && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ₹{tier.originalPrice}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ₹{(tier.price / tier.quantity).toFixed(0)} per interview
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What's included:
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• AI-powered interview analysis</li>
            <li>• Detailed performance feedback</li>
            <li>• Question-by-question insights</li>
            <li>• Follow-up questions based on responses</li>
            <li>• Comprehensive scoring report</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Purchase ₹{selectedTier.price}</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};