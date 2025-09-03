import { create } from "zustand";
import { userState } from "../types/userStoreTypes";

export const useUserStore = create<userState>((set) => ({
  maxWarnings: 3,
  setMaxWarnings: (maxWarnings) => {
    set({ maxWarnings });
  },

  currentWarnings: 0,
  setCurrentWarnings: (currentWarnings) => {
    set({ currentWarnings });
  },

  userStats: { totalInterview: 0, completedInterview: 0, interviewLeft: 0 },
  setUserStats: (userStats) => {
    set({ userStats });
  },

  userActivity: [],
  setUserActivity: (userActivity) => {
    set({ userActivity });
  },

  userPayment: [],
  setUserPayment: (userPayment) => {
    set({ userPayment });
  },
}));
