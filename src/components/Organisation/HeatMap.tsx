import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { HeatMapData } from '../../types/organisationTypes';

interface HeatMapProps {
  data: HeatMapData[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-emerald-200 dark:bg-emerald-900';
    if (count <= 4) return 'bg-emerald-400 dark:bg-emerald-700';
    if (count <= 6) return 'bg-emerald-600 dark:bg-emerald-500';
    return 'bg-emerald-800 dark:bg-emerald-400';
  };

  const weeks = Array.from({ length: 12 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDataForCell = (week: number, day: number) => {
    return data.find(d => d.week === week && d.day === day);
  };

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Interview Activity Heatmap
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            <div className="flex flex-col justify-around mr-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="h-4 text-xs text-gray-500 dark:text-gray-400 flex items-center"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {weeks.map((week) => (
                <div key={week} className="flex flex-col gap-1">
                  {days.map((_, dayIndex) => {
                    const cellData = getDataForCell(week, dayIndex);
                    const count = cellData?.count || 0;

                    return (
                      <motion.div
                        key={`${week}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (week * 7 + dayIndex) * 0.01 }}
                        whileHover={{ scale: 1.2 }}
                        className={`w-4 h-4 rounded-sm ${getIntensityColor(count)} cursor-pointer relative group`}
                        title={`${count} interviews${cellData ? ` on ${cellData.date}` : ''}`}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {cellData ? cellData.date : 'No data'}: {count} interviews
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 2, 4, 6, 8].map((val) => (
                <div
                  key={val}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(val)}`}
                />
              ))}
            </div>
            <span>More</span>
            <span className="ml-4 text-gray-500 dark:text-gray-400">
              Peak: {maxCount} interviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
