import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Calendar, Clock, Eye, FileText } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/ui/BackButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";

const InterviewHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const recentActivity = useUserStore((state) => state.userActivity);

  const userStats = useUserStore((state) => state.userStats);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 6)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  function formatDuration(start: Date, end: Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // @ts-expect-error ts issue
    const diffMs = endDate - startDate;

    if (diffMs < 0) {
      return "Invalid time range";
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar {...userStats} recentActivity={recentActivity} />

        <div className="flex-1 h-full p-4 lg:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto w-full"
          >
            <BackButton to="/dashboard" label="Back to Dashboard" />
            <Breadcrumb items={[{ label: "Interview History" }]} />

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Interview History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review your past interview performances and track your progress
              </p>
            </div>

            {recentActivity.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No interviews yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start your first mock interview to see your history here
                </p>
                <Button
                  onClick={() => (window.location.href = "/mock-interview")}
                >
                  Start First Interview
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((interview, index) => {
                  if (interview.score !== null)
                    return (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {interview.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                  interview.status.toLowerCase()
                                )}`}
                              >
                                {interview.status}
                              </span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar size={16} />
                                <span>
                                  {new Date(
                                    interview.startTime
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock size={16} />

                                <span>
                                  {formatDuration(
                                    interview.startTime,
                                    interview.endTime
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText size={16} />
                                <span>
                                  {interview.answeredQuestions}/
                                  {interview.questionsLength} questions
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div
                                className={`text-2xl font-bold ${getScoreColor(
                                  interview.score
                                )}`}
                              >
                                {interview.score}/10
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(
                                  interview.score
                                )}`}
                              >
                                {interview.score >= 8
                                  ? "Excellent"
                                  : interview.score >= 6
                                  ? "Good"
                                  : "Needs Work"}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2"
                              onClick={() =>
                                navigate("/result?id=" + interview.id)
                              }
                            >
                              <Eye size={16} />
                              <span>View Details</span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                })}
              </div>
            )}

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Performance Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {
                      recentActivity.filter(
                        (interview) =>
                          interview.score !== null &&
                          interview.score !== undefined
                      ).length
                    }
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Interviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {recentActivity.length > 0
                      ? (() => {
                          const validScores = recentActivity.filter(
                            (interview) =>
                              interview.score !== null &&
                              interview.score !== undefined
                          );

                          if (validScores.length === 0) return "0";

                          const total = validScores.reduce(
                            (acc, interview) => acc + interview.score,
                            0
                          );

                          return (total / validScores.length).toFixed(1);
                        })()
                      : "0"}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average Score
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {recentActivity.filter((i) => i.score >= 8).length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Excellent Scores
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
