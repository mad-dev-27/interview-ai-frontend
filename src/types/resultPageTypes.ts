export interface OverallFeedback {
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

export interface QuestionFeedback {
  id: string;
  isFollowUp: boolean;
  question: string;
  answer: {
    id: string;
    userAnswer: string;
    llmResponse: {
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
  };
}

export interface ApiResponse {
  overallFeedback: {
    msg: string;
    feedback: OverallFeedback;
  };
  questionFeedbacks: QuestionFeedback[];
}

export interface ApiResponseHistory {
  overallFeedback: OverallFeedback;
  questionFeedbacks: QuestionFeedback[];
}
