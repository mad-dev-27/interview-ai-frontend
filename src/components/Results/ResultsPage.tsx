import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, AlertCircle, CheckCircle, RotateCcw, MessageSquare } from 'lucide-react';
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

interface QuestionFeedback {
  question: string;
  response: string;
  score: number;
  feedback: string;
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

const mockQuestionFeedback: QuestionFeedback[] = [
  {
    question: "Tell me about yourself and your background.",
    response: "I am a software engineer with 5 years of experience...",
    score: 85,
    feedback: "Good structure and relevant information. Consider adding more specific achievements and quantifiable results."
  },
  {
    question: "What are your greatest strengths and how do they apply to this role?",
    response: "My greatest strength is problem-solving...",
    score: 78,
    feedback: "Strong examples provided. Could benefit from more specific examples that directly relate to the job requirements."
  },
  {
    question: "Describe a challenging project you've worked on and how you overcame obstacles.",
    response: "I worked on a complex web application...",
    score: 92,
    feedback: "Excellent use of STAR method. Clear problem definition, actions taken, and measurable results. Very compelling response."
  },
  {
    question: "Where do you see yourself in 5 years?",
    response: "In 5 years, I see myself in a leadership role...",
    score: 70,
    feedback: "Good vision but could be more specific about how this aligns with the company's goals and growth opportunities."
  },
  {
    question: "Why are you interested in this position and our company?",
    response: "I'm interested because of the company's innovative approach...",
    score: 88,
    feedback: "Shows good research about the company. Demonstrates genuine interest and alignment with company values."
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

        {/* Question-by-Question Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
            Question-by-Question Analysis
          </h2>
          
          <div className="space-y-6">
            {mockQuestionFeedback.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-4">
                    Q{index + 1}: {item.question}
                  </h3>
                  <div className={`text-xl font-bold px-3 py-1 rounded-lg ${getScoreColor(item.score)} bg-opacity-10`}>
                    {item.score}%
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Your Response:</p>
                  <p className="text-gray-800 dark:text-gray-200 italic">"{item.response.substring(0, 100)}..."</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">AI Feedback:</p>
                  <p className="text-gray-700 dark:text-gray-300">{item.feedback}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
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