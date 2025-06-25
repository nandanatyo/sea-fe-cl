import { MEAL_PLANS } from "@/lib/constants";

export const calculateSubscriptionPrice = (
  planId: string,
  mealTypesCount: number,
  deliveryDaysCount: number
): number => {
  const plan = MEAL_PLANS.find((p) => p.id === planId);
  if (!plan || mealTypesCount === 0 || deliveryDaysCount === 0) {
    return 0;
  }

  return plan.price * mealTypesCount * deliveryDaysCount * 4.3;
};

export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const calculateMRR = (subscriptions: any[]): number => {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((total, sub) => total + sub.totalPrice, 0);
};
