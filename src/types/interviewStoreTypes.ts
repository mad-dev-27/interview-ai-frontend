export type question = {
  id: string;
  question: string;
  isCompleted: boolean;
  isFollowUp: boolean;
};

export type questionState = {
  questions: question[];
  setQuestions: (questions: question[]) => void;
  addQuestion: (q: question) => void;
  updateQuestion: (id: string, updates: Partial<question>) => void;
  removeQuestion: (id: string) => void;
};
