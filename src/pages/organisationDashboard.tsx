import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, X } from 'lucide-react';
import { StatCards } from '../components/Organisation/StatCards';
import { StudentsList } from '../components/Organisation/StudentsList';
import { HeatMap } from '../components/Organisation/HeatMap';
import { PerformanceChart } from '../components/Organisation/PerformanceChart';
import { TopPerformers } from '../components/Organisation/TopPerformers';
import { AreasOfImprovement } from '../components/Organisation/AreasOfImprovement';
import { Button } from '../components/ui/Button';
import {
  OrganisationStats,
  StudentPerformance,
  PerformanceTrend,
  HeatMapData,
  ImprovementArea,
} from '../types/organisationTypes';

const OrganisationDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const stats: OrganisationStats = {
    interviewsRemaining: 'unlimited',
    interviewsPerStudent: 1,
    totalStudents: 45,
    averageOverallScore: 78.5,
    averageAnswerScore: 82.3,
    averageConfidence: 75.8,
    averageQuestionsCompleted: 8.4,
  };

  const students: StudentPerformance[] = [
    {
      id: '1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@university.edu',
      totalInterviews: 12,
      completedInterviews: 12,
      averageScore: 89.5,
      averageConfidence: 85.2,
      averageAnswerScore: 90.1,
      averageQuestionsCompleted: 9.5,
      lastInterviewDate: new Date('2025-10-03'),
      improvementAreas: ['Technical Depth', 'Communication'],
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@university.edu',
      totalInterviews: 10,
      completedInterviews: 10,
      averageScore: 87.2,
      averageConfidence: 83.5,
      averageAnswerScore: 88.7,
      averageQuestionsCompleted: 9.2,
      lastInterviewDate: new Date('2025-10-02'),
      improvementAreas: ['Problem Solving', 'Time Management'],
    },
    {
      id: '3',
      name: 'Rohan Kumar',
      email: 'rohan.kumar@university.edu',
      totalInterviews: 9,
      completedInterviews: 9,
      averageScore: 85.8,
      averageConfidence: 81.9,
      averageAnswerScore: 86.4,
      averageQuestionsCompleted: 8.9,
      lastInterviewDate: new Date('2025-10-01'),
      improvementAreas: ['Communication', 'Confidence'],
    },
    {
      id: '4',
      name: 'Ananya Singh',
      email: 'ananya.singh@university.edu',
      totalInterviews: 8,
      completedInterviews: 8,
      averageScore: 82.5,
      averageConfidence: 79.3,
      averageAnswerScore: 84.1,
      averageQuestionsCompleted: 8.5,
      lastInterviewDate: new Date('2025-09-30'),
      improvementAreas: ['Technical Depth', 'Problem Solving'],
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      email: 'vikram.reddy@university.edu',
      totalInterviews: 8,
      completedInterviews: 8,
      averageScore: 80.3,
      averageConfidence: 77.8,
      averageAnswerScore: 82.5,
      averageQuestionsCompleted: 8.3,
      lastInterviewDate: new Date('2025-09-29'),
      improvementAreas: ['Confidence', 'Time Management'],
    },
    {
      id: '6',
      name: 'Ishita Gupta',
      email: 'ishita.gupta@university.edu',
      totalInterviews: 7,
      completedInterviews: 7,
      averageScore: 78.9,
      averageConfidence: 76.2,
      averageAnswerScore: 80.7,
      averageQuestionsCompleted: 8.0,
      lastInterviewDate: new Date('2025-09-28'),
      improvementAreas: ['Communication', 'Technical Depth'],
    },
  ];

  const performanceTrends: PerformanceTrend[] = [
    { date: 'Sep 20', averageScore: 72.5, averageConfidence: 70.2, averageAnswerScore: 75.3, completedQuestions: 75 },
    { date: 'Sep 23', averageScore: 74.8, averageConfidence: 72.5, averageAnswerScore: 77.1, completedQuestions: 78 },
    { date: 'Sep 26', averageScore: 76.2, averageConfidence: 73.8, averageAnswerScore: 78.9, completedQuestions: 80 },
    { date: 'Sep 29', averageScore: 77.5, averageConfidence: 74.9, averageAnswerScore: 80.2, completedQuestions: 82 },
    { date: 'Oct 02', averageScore: 78.5, averageConfidence: 75.8, averageAnswerScore: 82.3, completedQuestions: 84 },
  ];

  const generateMonthData = (year: number, month: number): HeatMapData[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.floor(Math.random() * 10),
      day: (firstDay + i) % 7,
      dayOfMonth: i + 1,
    }));
  };

  const improvementAreas: ImprovementArea[] = [
    { area: 'Communication Skills', count: 28, percentage: 62.2 },
    { area: 'Technical Depth', count: 25, percentage: 55.6 },
    { area: 'Problem Solving', count: 22, percentage: 48.9 },
    { area: 'Confidence', count: 18, percentage: 40.0 },
    { area: 'Time Management', count: 15, percentage: 33.3 },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                Organisation Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor student performance and analytics
              </p>
            </div>

            <Button
              onClick={() => setIsSearchModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search Students
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isSearchModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
              onClick={() => setIsSearchModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Search Students
                    </h3>
                    <button
                      onClick={() => setIsSearchModalOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                  </div>

                  {searchQuery && (
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        <div className="space-y-2">
                          {filteredStudents.map((student) => (
                            <motion.div
                              key={student.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                              onClick={() => {
                                setIsSearchModalOpen(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {student.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {student.email}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {student.averageScore.toFixed(1)}%
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {student.completedInterviews} interviews
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No students found matching your search.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCards stats={stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TopPerformers students={students} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <PerformanceChart data={performanceTrends} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <HeatMap generateMonthData={generateMonthData} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AreasOfImprovement areas={improvementAreas} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Engagement Metrics
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Practice Time</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">42 min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">per session</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">+12% this month</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">87%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">of started interviews</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">+5% this month</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">38/45</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">in last 7 days</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">84% active</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Improvement Rate</p>
                      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">+15%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">avg score increase</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">month over month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StudentsList students={students} />
        </motion.div>
      </div>
    </div>
  );
};

export default OrganisationDashboard;
