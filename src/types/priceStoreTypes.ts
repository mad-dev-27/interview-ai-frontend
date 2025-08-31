export type price = {
  id: string;
  qty: number;
  price: number;
  originalPrice: number;
  savings: number;
  popular: boolean;
};

export type pricingState = {
  price: price[];
  setPricing: (price: price[]) => void;
};
