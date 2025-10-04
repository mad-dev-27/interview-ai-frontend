import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Target,
  Award,
  MessageSquare,
  CheckCircle,
  Infinity
} from 'lucide-react';
import { OrganisationStats } from '../../types/organisationTypes';

interface StatCardsProps {
  stats: OrganisationStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Interviews Remaining',
      value: stats.interviewsRemaining === 'unlimited' ? '∞' : stats.interviewsRemaining,
      icon: stats.interviewsRemaining === 'unlimited' ? Infinity : Target,
      color: 'blue',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Interviews Per Student',
      value: stats.interviewsPerStudent,
      icon: Users,
      color: 'emerald',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-900/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'violet',
      bgLight: 'bg-violet-50',
      bgDark: 'bg-violet-900/20',
      iconBg: 'bg-violet-100 dark:bg-violet-800',
      iconColor: 'text-violet-600 dark:text-violet-400',
      textColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      title: 'Avg Overall Score',
      value: `${stats.averageOverallScore.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'amber',
      bgLight: 'bg-amber-50',
      bgDark: 'bg-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Avg Answer Score',
      value: `${stats.averageAnswerScore.toFixed(1)}%`,
      icon: MessageSquare,
      color: 'rose',
      bgLight: 'bg-rose-50',
      bgDark: 'bg-rose-900/20',
      iconBg: 'bg-rose-100 dark:bg-rose-800',
      iconColor: 'text-rose-600 dark:text-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Avg Confidence',
      value: `${stats.averageConfidence.toFixed(1)}%`,
      icon: Award,
      color: 'cyan',
      bgLight: 'bg-cyan-50',
      bgDark: 'bg-cyan-900/20',
      iconBg: 'bg-cyan-100 dark:bg-cyan-800',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      textColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'Avg Questions Completed',
      value: stats.averageQuestionsCompleted.toFixed(1),
      icon: CheckCircle,
      color: 'green',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`${card.bgLight} ${card.bgDark} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.iconBg} rounded-lg p-3`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {card.title}
          </h3>
          <p className={`text-3xl font-bold ${card.textColor}`}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
