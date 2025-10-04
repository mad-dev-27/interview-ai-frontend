import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, TrendingUp, Award } from 'lucide-react';
import { StudentPerformance } from '../../types/organisationTypes';
import { Button } from '../ui/Button';

interface StudentsListProps {
  students: StudentPerformance[];
}

export const StudentsList: React.FC<StudentsListProps> = ({ students }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sortedStudents = [...students].sort((a, b) => b.totalInterviews - a.totalInterviews);
  const topStudents = sortedStudents.slice(0, 10);

  const filteredStudents = sortedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StudentCard = ({ student, index }: { student: StudentPerformance; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {student.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Interviews</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {student.totalInterviews}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {student.averageScore.toFixed(1)}%
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {student.averageConfidence.toFixed(1)}%
              </p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                {student.averageQuestionsCompleted.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Top Students
        </h2>
        <Button
          onClick={() => setShowAllModal(true)}
          variant="outline"
          className="text-sm"
        >
          View All ({students.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {topStudents.map((student, index) => (
          <StudentCard key={student.id} student={student} index={index} />
        ))}
      </div>

      <AnimatePresence>
        {showAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    All Students ({students.length})
                  </h2>
                  <button
                    onClick={() => setShowAllModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <StudentCard key={student.id} student={student} index={index} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No students found matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
