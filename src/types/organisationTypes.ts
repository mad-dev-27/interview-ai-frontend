export interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  averageConfidence: number;
  averageAnswerScore: number;
  averageQuestionsCompleted: number;
  lastInterviewDate: Date;
  improvementAreas: string[];
}

export interface OrganisationStats {
  interviewsRemaining: number | 'unlimited';
  interviewsPerStudent: number;
  totalStudents: number;
  averageOverallScore: number;
  averageAnswerScore: number;
  averageConfidence: number;
  averageQuestionsCompleted: number;
}

export interface PerformanceTrend {
  date: string;
  averageScore: number;
  averageConfidence: number;
  averageAnswerScore: number;
  completedQuestions: number;
}

export interface HeatMapData {
  date: string;
  count: number;
  day: number;
  dayOfMonth?: number;
}

export interface ImprovementArea {
  area: string;
  count: number;
  percentage: number;
}
