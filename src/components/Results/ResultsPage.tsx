import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  MessageSquare,
  User,
  Target,
  Lightbulb,
  Brain,
  Star,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../ui/Button";
import { API_URL } from "../../config";
import Cookies from "js-cookie";
import axios from "axios";
import { useQuestionStore } from "../../store/interviewStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ResultsPageProps {
  responses: string[];
  jobDescription: string;
  resume: File | null;
  onRestart: () => void;
}

interface OverallFeedback {
  overall_score: number;
  strengths: string[];
  areas_to_improve: string[];
  analysis: {
    communication: string;
    technical_depth: string;
    confidence: string;
    relevance_to_role: string;
  };
  interviewer_impression: {
    positives: string[];
    concerns: string[];
  };
  final_recommendation: string;
  final_feedback: string;
}

interface QuestionFeedback {
  msg: string;
  llmFeedback: {
    msg: string;
    feedback: {
      score: number;
      strengths: string[];
      areas_to_improve: string[];
      suggested_answer: string;
      confidence_analysis: {
        tone: string;
        filler_words: string;
        clarity: string;
        confidence_score: number;
      };
      follow_up_questions: string[];
      final_feedback: string;
    };
  };
  followUpQuestion: boolean;
  followQuestion?: {
    id: string;
    question: string;
    isFollowUp: boolean;
    mainQuestionId?: string;
  };
}

const defaultOverallFeedback = {
  overall_score: 0 - 10,
  strengths: [
    "Explained technical concepts in simple, understandable language",
    "Showed good familiarity with the core tools and frameworks relevant to the role",
    "Displayed adaptability when questions were rephrased or challenged",
    "Maintained professionalism and calm tone throughout",
  ],
  areas_to_improve: [
    "Add more specific project-based examples to back up technical claims",
    "Work on conciseness — some answers drifted before getting to the key point",
    "Confidence dipped slightly in complex scenario questions — practice pausing and structuring thoughts before answering",
    "Occasionally missed tying answers back to job role and responsibilities",
  ],
  analysis: {
    communication:
      "Generally clear, though occasional filler words reduced polish. Structuring answers with 'problem–solution–result' would help.",
    technical_depth:
      "Solid foundation, but some responses lacked depth in real-world application and trade-offs.",
    confidence:
      "Moderate to strong. Voice tone steady, but slight hesitation when unsure. Practicing mock Q&A under time pressure may help.",
    relevance_to_role:
      "Experience and skills align well, but some advanced role requirements were not fully demonstrated.",
  },
  interviewer_impression: {
    positives: [
      "Comes across as reliable and hardworking",
      "Good cultural fit potential — collaborative and open",
      "Willingness to learn and adapt is evident",
    ],
    concerns: [
      "May need extra mentoring initially on advanced responsibilities",
      "Sometimes struggled to highlight measurable impact of past work",
    ],
  },
  final_recommendation: "Hire / Borderline / No Hire",
  final_feedback:
    "Overall, you demonstrated strong technical and interpersonal qualities, with clear potential to succeed in this role. Focusing on structuring your answers, reducing filler words, and backing up statements with specific examples will significantly elevate your performance. Keep practicing — you’re on the right track.",
};

const questionFeedBackDefaultObject = {
  msg: "ok",
  llmFeedback: {
    msg: "ok",
    feedback: {
      score: 6,
      strengths: [
        "Identifies automatic scaling as a key benefit of Cloudflare Workers.",
        "Correctly points out that cost is based on the number of requests in Cloudflare Workers.",
      ],
      areas_to_improve: [
        "The explanation could be more detailed and structured.",
        "Lacks specific benefits beyond scaling and cost, such as latency improvements and reduced operational overhead.",
        "Doesn't mention the 'edge computing' aspect, which is a core advantage of Cloudflare Workers.",
        "Needs clearer articulation and better organization for improved clarity.",
      ],
      suggested_answer:
        "Cloudflare Workers were advantageous for the Arc blogging platform due to their ability to automatically scale, handling traffic spikes without manual intervention, which is more complex with traditional servers, where you'd need to configure auto-scaling groups. Also, Cloudflare Workers operate on a pay-per-request model, optimizing costs, especially during low-traffic periods. The distributed nature of Cloudflare's edge network reduces latency by serving content closer to users, enhancing the user experience. This setup also simplifies operational overhead, as server management is handled by Cloudflare, allowing more focus on application development.",
      confidence_analysis: {
        tone: "Neutral",
        filler_words: "None",
        clarity: "Moderately clear, but could be more structured.",
        confidence_score: 6,
      },
      follow_up_questions: [
        "How did Cloudflare Workers' serverless architecture impact the development and deployment workflow for the Arc blogging platform?",
      ],
      final_feedback:
        "Your response touches on the scalability and cost benefits, but digging deeper into the architectural advantages and impact on user experience will significantly level up your answer.",
    },
  },
  followUpQuestion: true,
  followQuestion: {
    id: "480cc339-5516-4137-8537-b8dd39585f1f",
    interviewId: "eb981040-2d70-4fa1-aae0-cb932944e230",
    question:
      "How did Cloudflare Workers' serverless architecture impact the development and deployment workflow for the Arc blogging platform?",
    resumeContent:
      "Narendira is a Full-stack developer with proficiency in HTML, CSS, JavaScript, TypeScript, React.js, Node.js, Express.js, Prisma, Hono, Tailwind CSS, Bootstrap, Postgres, MongoDB, Git, Github, AWS, Cloud Flare, Docker, and Linux. He has experience building web applications with responsive designs and user authentication, as demonstrated by projects like Arc (blogging platform), Short URL (URL shortener), and Secure Pay (wallet-to-wallet payment system). He also has experience with Monorepos and Turborepo.",
    jobDescriptionContent:
      "The job description is for a Frontend Developer with experience in Front-End Development, Responsive Web Design, Back-End Web Development, and general Web Development. The role requires proficiency in software development principles, problem-solving, and independent work. Experience in the healthcare industry is a plus. The role involves developing user interface components, creating responsive web designs, and optimizing applications for speed and scalability.",
    isFollowUp: true,
    mainQuestionId: "6df5ac8e-d118-4fd8-928f-b9d3182aee3c",
    isCompleted: false,
    createdAt: "2025-08-29T12:38:38.872Z",
    updatedAt: "2025-08-29T12:38:38.872Z",
  },
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  responses,

  onRestart,
}) => {
  const [overallFeedback, setOverallFeedback] =
    useState<OverallFeedback | null>(defaultOverallFeedback);
  const [questionFeedbacks, setQuestionFeedbacks] = useState<
    QuestionFeedback[]
  >([questionFeedBackDefaultObject]);
  const [loading, setLoading] = useState(true);
  const { questions } = useQuestionStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        const token = Cookies.get("auth");

        const response = await axios.get(
          `${API_URL}/user/result?sessionId=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response);

        setOverallFeedback(response.data.overallFeedback);
        setQuestionFeedbacks(response.data.questionFeedbacks);
      } catch (error) {
        toast.info(
          "We couldn’t load your overall report right now. Please check your Interview History in the dashboard"
        );
        navigate("/");
        console.error("Error fetching results:", error);
        // Handle error appropriately
        console.error("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Analyzing your interview performance...
          </p>
        </div>
      </div>
    );
  }

  if (!overallFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Failed to load results. Please try again.
          </p>
          <Button onClick={onRestart} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8)
      return <Award className="w-6 h-6 text-green-600 dark:text-green-400" />;
    if (score >= 6)
      return (
        <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      );
    return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
  };

  const getRecommendationColor = (recommendation: string) => {
    if (
      recommendation.toLowerCase().includes("hire") &&
      !recommendation.toLowerCase().includes("no")
    ) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    if (recommendation.toLowerCase().includes("borderline")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
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
            <div
              className={`text-6xl font-bold mb-4 ${getScoreColor(
                overallFeedback.overall_score
              )}`}
            >
              {overallFeedback.overall_score}/10
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {getScoreIcon(overallFeedback.overall_score)}
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Overall Performance
              </h2>
            </div>
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getRecommendationColor(
                overallFeedback.final_recommendation
              )}`}
            >
              {overallFeedback.final_recommendation}
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {overallFeedback.final_feedback}
            </p>
          </div>
        </motion.div>

        {/* Strengths and Areas to Improve */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Strengths
              </h3>
            </div>
            <ul className="space-y-3">
              {overallFeedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Areas to Improve
              </h3>
            </div>
            <ul className="space-y-3">
              {overallFeedback.areas_to_improve.map((area, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Detailed Analysis
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(overallFeedback.analysis).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {key.replace("_", " ")}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interviewer Impression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Interviewer Impression
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">
                Positive Impressions
              </h4>
              <ul className="space-y-2">
                {overallFeedback.interviewer_impression.positives.map(
                  (positive, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {positive}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-3">
                Areas of Concern
              </h4>
              <ul className="space-y-2">
                {overallFeedback.interviewer_impression.concerns.map(
                  (concern, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {concern}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Question-by-Question Feedback */}
        {questionFeedbacks.length > 0 && (
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
              {questionFeedbacks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Question {index + 1}
                        </h3>
                        {item.followQuestion?.isFollowUp && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                            Follow-up
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {item.followQuestion?.question ||
                          questions[index]?.question ||
                          "Question not available"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`text-2xl font-bold mb-1 ${getScoreColor(
                          item.llmFeedback.feedback.score
                        )}`}
                      >
                        {item.llmFeedback.feedback.score}/10
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <
                              Math.round(item.llmFeedback.feedback.score / 2)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Confidence Analysis */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        <Brain className="w-4 h-4 inline mr-2" />
                        Confidence & Communication Analysis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Tone:
                          </span>
                          <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {item.llmFeedback.feedback.confidence_analysis.tone}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Clarity:
                          </span>
                          <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {
                              item.llmFeedback.feedback.confidence_analysis
                                .clarity
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Filler Words:
                          </span>
                          <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {
                              item.llmFeedback.feedback.confidence_analysis
                                .filler_words
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Confidence:
                          </span>
                          <p
                            className={`font-medium ${getScoreColor(
                              item.llmFeedback.feedback.confidence_analysis
                                .confidence_score
                            )}`}
                          >
                            {
                              item.llmFeedback.feedback.confidence_analysis
                                .confidence_score
                            }
                            /10
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Your Response */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Your Response
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                          "{responses[index] || "No response recorded"}"
                        </p>
                      </div>
                    </div>
                    {/* Strengths */}
                    {item.llmFeedback.feedback.strengths.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          What You Did Well
                        </h4>
                        <ul className="space-y-1">
                          {item.llmFeedback.feedback.strengths.map(
                            (strength, strengthIndex) => (
                              <li
                                key={strengthIndex}
                                className="flex items-start space-x-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {strength}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Areas to Improve */}
                    {item.llmFeedback.feedback.areas_to_improve.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {item.llmFeedback.feedback.areas_to_improve.map(
                            (area, areaIndex) => (
                              <li
                                key={areaIndex}
                                className="flex items-start space-x-2 text-sm"
                              >
                                <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {area}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* AI Feedback */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        <Brain className="w-4 h-4 inline mr-2" />
                        AI Feedback
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {item.llmFeedback.feedback.final_feedback}
                      </p>
                    </div>

                    {/* Suggested Answer */}
                    {item.llmFeedback.feedback.suggested_answer && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          <Lightbulb className="w-4 h-4 inline mr-2" />
                          Suggested Approach
                        </h4>
                        <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                          {item.llmFeedback.feedback.suggested_answer}
                        </p>
                      </div>
                    )}

                    {/* Follow-up Questions */}
                    {item.llmFeedback.feedback.follow_up_questions &&
                      item.llmFeedback.feedback.follow_up_questions.length >
                        0 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-2" />
                            Potential Follow-up Questions
                          </h4>
                          <ul className="space-y-1">
                            {item.llmFeedback.feedback.follow_up_questions.map(
                              (question, qIndex) => (
                                <li
                                  key={qIndex}
                                  className="text-orange-800 dark:text-orange-200 text-sm"
                                >
                                  • {question}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
            Performance Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {questionFeedbacks.length > 0
                  ? Math.round(
                      (questionFeedbacks.reduce(
                        (acc, item) => acc + item.llmFeedback.feedback.score,
                        0
                      ) /
                        questionFeedbacks.length) *
                        10
                    ) / 10
                  : "N/A"}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Question Score
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {questionFeedbacks.length > 0
                  ? Math.round(
                      (questionFeedbacks.reduce(
                        (acc, item) =>
                          acc +
                          item.llmFeedback.feedback.confidence_analysis
                            .confidence_score,
                        0
                      ) /
                        questionFeedbacks.length) *
                        10
                    ) / 10
                  : "N/A"}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Confidence
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {questionFeedbacks.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Questions Completed
              </p>
            </div>
          </div>
        </motion.div>
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center space-x-4"
        >
          <Button
            onClick={onRestart}
            className="inline-flex items-center mb-4 lg:mb-0 space-x-2"
          >
            <LayoutDashboard size={16} />
            <span>Go to Dashboard</span>
          </Button>
          <Button
            className="hidden lg:inline"
            variant="outline"
            onClick={() => window.print()}
          >
            Download Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
