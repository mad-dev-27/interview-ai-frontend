import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { StudentPerformance } from '../../types/organisationTypes';

interface TopPerformersProps {
  students: StudentPerformance[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ students }) => {
  const topThree = [...students]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return Trophy;
      case 1:
        return Medal;
      case 2:
        return Award;
      default:
        return Award;
    }
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        };
      case 1:
        return {
          bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-400',
          iconBg: 'bg-gray-100 dark:bg-gray-900/30',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-400',
          iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Top Performers
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topThree.map((student, index) => {
          const Icon = getMedalIcon(index);
          const colors = getMedalColor(index);

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border-2 ${colors.border} hover:shadow-xl transition-all duration-300`}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className={`${colors.bg} rounded-full p-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className={`w-20 h-20 mx-auto ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg`}>
                  {student.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {student.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {student.email}
                </p>

                <div className={`${colors.iconBg} rounded-lg p-4 space-y-3`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Score
                    </span>
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {student.averageScore.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Confidence
                    </span>
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {student.averageConfidence.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Interviews
                    </span>
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {student.totalInterviews}
                    </span>
                  </div>
                </div>

                <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.iconBg}`}>
                  Rank #{index + 1}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
