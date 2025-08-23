import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building, Mail, User, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CustomPricingModalProps {
  onClose: () => void;
}

export const CustomPricingModal: React.FC<CustomPricingModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    interviewCount: '',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Custom pricing request:', formData);
    // You would typically send this to your backend
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Custom Pricing Request
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="name"
                type="text"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="email"
                type="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="companyName"
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="interviewCount"
                type="number"
                placeholder="Expected Interview Count"
                value={formData.interviewCount}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div>
              <textarea
                name="requirements"
                placeholder="Tell us about your specific requirements..."
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Submit Request
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>What happens next?</strong><br />
            Our team will review your requirements and get back to you within 24 hours with a customized pricing proposal.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};