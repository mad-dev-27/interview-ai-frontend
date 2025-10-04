import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeatMapData } from '../../types/organisationTypes';

interface HeatMapProps {
  generateMonthData: (year: number, month: number) => HeatMapData[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ generateMonthData }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredCell, setHoveredCell] = React.useState<{ day: number } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const data = generateMonthData(year, month);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    if (count <= 2) return 'bg-emerald-200 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-800';
    if (count <= 4) return 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600';
    if (count <= 6) return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400';
    return 'bg-emerald-800 dark:bg-emerald-400 border-emerald-900 dark:border-emerald-300';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const totalInterviews = data.reduce((sum, d) => sum + d.count, 0);

  const weeksArray = [];
  let currentWeek = [];

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeksArray.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeksArray.push(currentWeek);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Activity Calendar
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px] text-center">
                {monthName}
              </p>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInterviews}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            {weeksArray.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-full h-12" />;
                  }

                  const cellData = data.find(d => d.dayOfMonth === day);
                  const count = cellData?.count || 0;
                  const isHovered = hoveredCell?.day === day;

                  return (
                    <motion.div
                      key={`${weekIndex}-${day}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: day * 0.01 }}
                      whileHover={{ scale: 1.05 }}
                      className={`w-full h-12 rounded-lg border-2 ${getIntensityColor(count)} cursor-pointer transition-all relative flex items-center justify-center`}
                      onMouseEnter={() => setHoveredCell({ day })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {day}
                      </span>
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
