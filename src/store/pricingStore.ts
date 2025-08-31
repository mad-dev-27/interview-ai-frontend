import { create } from "zustand";
import { pricingState } from "../types/priceStoreTypes";

export const usePricingStore = create<pricingState>((set) => ({
  price: [],
  setPricing: (price) => {
    set({ price });
  },
}));
