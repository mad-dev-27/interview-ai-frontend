import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingDown } from 'lucide-react';
import { ImprovementArea } from '../../types/organisationTypes';

interface AreasOfImprovementProps {
  areas: ImprovementArea[];
}

export const AreasOfImprovement: React.FC<AreasOfImprovementProps> = ({ areas }) => {
  const sortedAreas = [...areas].sort((a, b) => b.count - a.count);

  const getBarColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
    ];
    return colors[Math.min(index, colors.length - 1)];
  };

  const getBarColorDark = (index: number) => {
    const colors = [
      'dark:bg-red-400',
      'dark:bg-orange-400',
      'dark:bg-amber-400',
      'dark:bg-yellow-400',
      'dark:bg-lime-400',
    ];
    return colors[Math.min(index, colors.length - 1)];
  };

  const maxCount = Math.max(...areas.map(a => a.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Common Areas of Improvement
        </h2>
      </div>

      <div className="space-y-4">
        {sortedAreas.length > 0 ? (
          sortedAreas.map((area, index) => {
            const barWidth = (area.count / maxCount) * 100;

            return (
              <motion.div
                key={area.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {area.area}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {area.count} students
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {area.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    className={`h-full ${getBarColor(index)} ${getBarColorDark(index)} rounded-lg relative group-hover:opacity-90 transition-opacity`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                  </motion.div>

                  <div className="absolute inset-0 flex items-center px-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: barWidth > 20 ? 1 : 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-xs font-semibold text-white drop-shadow-md"
                    >
                      {area.percentage.toFixed(1)}%
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No improvement areas identified yet</p>
          </div>
        )}
      </div>

      {sortedAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Recommendation
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Focus training sessions on the top improvement areas: <strong>{sortedAreas[0]?.area}</strong>
              {sortedAreas[1] && <> and <strong>{sortedAreas[1].area}</strong></>} to maximize student performance gains.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
