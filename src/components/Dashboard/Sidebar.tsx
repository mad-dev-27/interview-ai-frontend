import React from "react";
import { motion } from "framer-motion";
import { Clock, Zap, BarChart3, User } from "lucide-react";

interface SidebarProps {
  recentInterviews: number;
  freeInterviewsLeft: number;
  totalInterviews: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  recentInterviews,
  freeInterviewsLeft,
  totalInterviews,
}) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-full lg:w-80 lg:h-full bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-4 lg:space-y-6 lg:overflow-y-auto"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Interview Stats
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {/* Recent Interviews */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Interviews
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {recentInterviews}
                </p>
              </div>
            </div>
          </div>

          {/* Free Interviews Left */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interviews Left
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {freeInterviewsLeft}
                </p>
              </div>
            </div>
          </div>

          {/* Total Available Interviews */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Interview
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalInterviews}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 hidden lg:block">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Software Engineer Interview
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 days ago • Score: 85%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
