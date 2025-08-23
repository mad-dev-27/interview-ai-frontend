import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/mock-interview');
  };

  const features = [
    {
      icon: Play,
      title: 'Start Mock Interview',
      description: 'Begin a new AI-powered interview session',
      action: 'Start Now',
      onClick: handleStartInterview,
      primary: true,
    },
    {
      icon: BookOpen,
      title: 'Interview History',
      description: 'Review your past interview performances',
      action: 'View History',
      onClick: () => {},
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track your improvement over time',
      action: 'View Analytics',
      onClick: () => {},
    },
    {
      icon: Award,
      title: 'Skill Assessment',
      description: 'Evaluate your technical and soft skills',
      action: 'Take Assessment',
      onClick: () => {},
    },
  ];

  return (
    <div className="flex-1 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to practice and improve your interview skills?
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${
                feature.primary ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  feature.primary 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.primary ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={feature.onClick}
                variant={feature.primary ? 'primary' : 'outline'}
                className="w-full"
              >
                {feature.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Tips for Success
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                STAR
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the STAR method for behavioral questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                2-3 min
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ideal response length for most questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                Practice
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regular practice leads to better performance
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};