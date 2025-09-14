import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { API_URL } from "../../config";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ResultContent from "./ResultContent";

import {
  ApiResponse,
  OverallFeedback,
  QuestionFeedback,
} from "../../types/resultPageTypes";

interface ResultsPageProps {
  responses: string[];
  jobDescription: string;
  resume: File | null;
  onRestart: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onRestart }) => {
  const [overallFeedback, setOverallFeedback] =
    useState<OverallFeedback | null>(null);
  const [questionFeedbacks, setQuestionFeedbacks] = useState<
    QuestionFeedback[]
  >([]);
  const [loading, setLoading] = useState(true);

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

        // console.log(response);

        const apiData: ApiResponse = response.data;

        // Extract the nested feedback objects
        setOverallFeedback(apiData.overallFeedback.feedback);
        setQuestionFeedbacks(apiData.questionFeedbacks);
      } catch (error) {
        toast.info(
          "We couldn't load your overall report right now. Please check your Interview History in the dashboard"
        );
        navigate("/dashboard");
        console.error("Error fetching results:", error);
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
    console.log(overallFeedback);
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

  return (
    <ResultContent
      overallFeedback={overallFeedback}
      questionFeedbacks={questionFeedbacks}
    />
  );
};
