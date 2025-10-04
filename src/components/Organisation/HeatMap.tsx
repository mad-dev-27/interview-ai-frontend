import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { HeatMapData } from '../../types/organisationTypes';

interface HeatMapProps {
  data: HeatMapData[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = React.useState<{ week: number; day: number } | null>(null);

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    if (count <= 2) return 'bg-emerald-200 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-800';
    if (count <= 4) return 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600';
    if (count <= 6) return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400';
    return 'bg-emerald-800 dark:bg-emerald-400 border-emerald-900 dark:border-emerald-300';
  };

  const weeks = Array.from({ length: 12 }, (_, i) => i);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDataForCell = (week: number, day: number) => {
    return data.find(d => d.week === week && d.day === day);
  };

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const totalInterviews = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Activity Heatmap
          </h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInterviews}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Interviews</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <div className="flex gap-2 justify-center">
            <div className="flex flex-col justify-around gap-2 pt-6">
              {days.map((day) => (
                <div
                  key={day}
                  className="h-6 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-end pr-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {weeks.map((week) => (
                <div key={week} className="flex flex-col gap-2">
                  <div className="h-6 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center">
                    W{week + 1}
                  </div>
                  {days.map((_, dayIndex) => {
                    const cellData = getDataForCell(week, dayIndex);
                    const count = cellData?.count || 0;
                    const isHovered = hoveredCell?.week === week && hoveredCell?.day === dayIndex;

                    return (
                      <motion.div
                        key={`${week}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (week * 7 + dayIndex) * 0.005 }}
                        whileHover={{ scale: 1.15, zIndex: 10 }}
                        className={`w-6 h-6 rounded-md border-2 ${getIntensityColor(count)} cursor-pointer transition-all relative`}
                        onMouseEnter={() => setHoveredCell({ week, day: dayIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50"
                          >
                            <div className="font-semibold">{cellData ? cellData.date : 'No data'}</div>
                            <div className="text-gray-300">{count} interviews</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Less</span>
            <div className="flex gap-1.5">
              {[0, 2, 4, 6, 8].map((val) => (
                <div
                  key={val}
                  className={`w-5 h-5 rounded-md border-2 ${getIntensityColor(val)}`}
                />
              ))}
            </div>
            <span className="font-medium">More</span>
            <span className="ml-3 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-medium">
              Peak: {maxCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
