import React from "react";
import { motion } from "framer-motion";
import { Clock, Zap, BarChart3, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { userActivityType } from "../../types/userStoreTypes";

interface SidebarProps {
  interviewLeft: number;
  completedInterview: number;
  totalInterview: number;
  recentActivity: userActivityType[];
}

const checkStatus = (item: userActivityType) => {
  if (item.isPreInterviewDone === true) {
    return "In Progress";
  }
  if (item.isComplete === true) {
    return "Complete";
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  interviewLeft,
  completedInterview,
  totalInterview,
  recentActivity,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Stats Card */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-4 mt-2 mx-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Interview Stats
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Recent Interviews */}
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {completedInterview}
            </p>
          </div>

          {/* Free Interviews Left */}
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Left</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {interviewLeft}
            </p>
          </div>

          {/* Total Available Interviews */}
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {totalInterview}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:block w-80 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 space-y-6 overflow-y-auto"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interview Stats
          </h2>

          <div className="grid grid-cols-1 gap-4">
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
                    {completedInterview}
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
                    {interviewLeft}
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
                    {totalInterview}
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
            {recentActivity.length > 0
              ? recentActivity
                  .slice(0, 6) // ✅ restrict to 6
                  .map((item) =>
                    item.name !== "Undefined" ? (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(item.updatedAt, {
                              addSuffix: true,
                            })}{" "}
                            • {checkStatus(item)}
                          </p>
                        </div>
                      </div>
                    ) : null
                  )
              : null}
            {recentActivity.length >= 6 && (
              <div className="text-center mt-3">
                <button
                  onClick={() => navigate("/interview-history")}
                  className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View All Activity →
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};
