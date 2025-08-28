import { create } from "zustand";
import { questionState } from "../types/interviewStoreTypes";

export const useQuestionStore = create<questionState>((set) => ({
  questions: [],

  setQuestions: (questions) => set({ questions }),

  addQuestion: (q) =>
    set((state) => ({
      questions: [...state.questions, q],
    })),

  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),

  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
}));
