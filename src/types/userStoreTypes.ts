type userStatsType = {
  totalInterview: number;
  completedInterview: number;
  interviewLeft: number;
};

export type userActivityType = {
  id: string;
  name: string;
  isComplete: boolean;
  isPreInterviewDone: boolean;
  startTime: Date;
  endTime: Date;
  status: string;
  score: number;
  updatedAt: Date;
  questionsLength: number;
  answeredQuestions: number;
};

type userPaymentType = {
  id: string;
  amount: string;
  orderQty: string;
  isCompleted: string;
  createdAt: string;
  updatedAt: string;
};

export type userState = {
  maxWarnings: number;
  setMaxWarnings: (maxWarnings: number) => void;
  currentWarnings: number;
  setCurrentWarnings: (currentWarnings: number) => void;
  userStats: userStatsType;
  setUserStats: (userStats: userStatsType) => void;
  userActivity: userActivityType[];
  setUserActivity: (userActivity: userActivityType[]) => void;
  userPayment: userPaymentType[];
  setUserPayment: (userPayment: userPaymentType[]) => void;
};
