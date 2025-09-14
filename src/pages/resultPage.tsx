import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultContent from "../components/Results/ResultContent";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../config";
import { toast } from "sonner";
import {
  ApiResponse,
  ApiResponseHistory,
  OverallFeedback,
  QuestionFeedback,
} from "../types/resultPageTypes";

const ResultPage = () => {
  const [overallFeedback, setOverallFeedback] =
    useState<OverallFeedback | null>(null);
  const [questionFeedbacks, setQuestionFeedbacks] = useState<
    QuestionFeedback[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = Cookies.get("auth");

        const response = await axios.get(
          `${API_URL}/user/result?sessionId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log(response);

        const apiData: ApiResponseHistory = response.data;

        // Extract the nested feedback objects

        setOverallFeedback(apiData.overallFeedback);
        setQuestionFeedbacks(apiData.questionFeedbacks);
        setIsLoading(false);
      } catch (error) {
        toast.info(
          "We couldn't load your overall report right now. Please check your Interview History in the dashboard"
        );
        navigate("/dashboard");
        console.error("Error fetching results:", error);
        setIsLoading(false);
      }
    };

    fetchResults();
    setIsLoading(false);
  }, []);

  if (isLoading || !overallFeedback) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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

export default ResultPage;
