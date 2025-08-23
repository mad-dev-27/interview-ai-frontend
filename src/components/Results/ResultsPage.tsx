import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ResultsPageProps {
  responses: string[];
  jobDescription: string;
  resume: File | null;
  onRestart: () => void;
}

interface Feedback {
  category: string;
  score: number;
  feedback: string;
  improvements: string[];
}

const mockFeedback: Feedback[] = [
  {
    category: "Communication Skills",
    score: 85,
    feedback: "Your responses demonstrate clear communication and good structure. You effectively articulate your thoughts and provide relevant examples.",
    improvements: [
      "Use more specific quantifiable achievements",
      "Practice the STAR method for behavioral questions",
      "Include more industry-specific terminology"
    ]
  },
  {
    category: "Technical Knowledge",
    score: 78,
    feedback: "Good technical understanding, but could benefit from more depth in explaining complex concepts and recent technology trends.",
    improvements: [
      "Stay updated with latest industry trends",
      "Provide more detailed technical explanations",
      "Include specific tools and technologies you've used"
    ]
  },
  {
    category: "Problem Solving",
    score: 90,
    feedback: "Excellent problem-solving approach with clear methodology. You break down complex problems effectively.",
    improvements: [
      "Consider alternative solutions more explicitly",
      "Discuss trade-offs in your decision making"
    ]
  },
  {
    category: "Leadership & Teamwork",
    score: 72,
    feedback: "Shows potential for leadership but could elaborate more on specific examples of team collaboration and conflict resolution.",
    improvements: [
      "Share more specific examples of leading teams",
      "Discuss how you handle conflicts",
      "Mention mentoring or helping team members"
    ]
  }
];

export const ResultsPage: React.FC<ResultsPageProps> = ({ 
  responses, 
  jobDescription, 
  resume, 
  onRestart 
}) => {
  const overallScore = Math.round(mockFeedback.reduce((acc, item) => acc + item.score, 0) / mockFeedback.length);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-6 h-6 text-green-600 dark:text-green-400" />;
    if (score >= 60) return <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here's your comprehensive performance analysis
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {getScoreIcon(overallScore)}
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Overall Performance
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {overallScore >= 80 && "Excellent performance! You're well-prepared for interviews."}
              {overallScore >= 60 && overallScore < 80 && "Good performance with room for improvement."}
              {overallScore < 60 && "There's significant room for improvement. Keep practicing!"}
            </p>
          </div>
        </motion.div>

        {/* Detailed Feedback */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {mockFeedback.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.category}
                </h3>
                <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.feedback}
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp size={16} className="mr-2" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {item.improvements.map((improvement, improvementIndex) => (
                    <li key={improvementIndex} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-x-4"
        >
          <Button onClick={onRestart} className="inline-flex items-center space-x-2">
            <RotateCcw size={16} />
            <span>Practice Again</span>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Download Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
};