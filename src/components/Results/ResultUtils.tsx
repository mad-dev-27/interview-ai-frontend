import { TrendingUp, Award, AlertCircle } from "lucide-react";

export const getScoreColor = (score: number) => {
  if (score >= 8) return "text-green-600 dark:text-green-400";
  if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const getScoreIcon = (score: number) => {
  if (score >= 8)
    return <Award className="w-6 h-6 text-green-600 dark:text-green-400" />;
  if (score >= 6)
    return (
      <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
    );
  return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
};

export const getRecommendationColor = (recommendation: string) => {
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

