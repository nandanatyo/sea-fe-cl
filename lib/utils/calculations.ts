// lib/utils/calculations.ts - Enhanced version with proper exports
import { MEAL_PLANS } from "@/lib/constants";
import { Plan } from "@/lib/types";

// Enhanced subscription price calculation that works with both static and dynamic plans
export const calculateSubscriptionPrice = (
  planId: string,
  mealTypesCount: number,
  deliveryDaysCount: number,
  availablePlans?: Plan[]
): number => {
  if (!planId || mealTypesCount === 0 || deliveryDaysCount === 0) {
    return 0;
  }

  // First try to find plan in provided available plans (backend data)
  let plan = availablePlans?.find((p) => p.id === planId);

  // Fallback to static plans if not found
  if (!plan) {
    plan = MEAL_PLANS.find((p) => p.id === planId);
  }

  if (!plan) {
    console.warn(
      `Plan with ID ${planId} not found in available plans or static plans`
    );
    return 0;
  }

  const totalPrice = plan.price * mealTypesCount * deliveryDaysCount * 4.3;

  console.log("💰 Price calculation:", {
    planId,
    planName: plan.name,
    planPrice: plan.price,
    mealTypesCount,
    deliveryDaysCount,
    multiplier: 4.3,
    totalPrice: Math.round(totalPrice),
    source: availablePlans ? "backend" : "static",
  });

  return Math.round(totalPrice);
};

export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  if (originalPrice <= 0 || discountedPrice < 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const calculateMRR = (subscriptions: any[]): number => {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .reduce(
      (total, sub) => total + (sub.totalPrice || sub.total_price || 0),
      0
    );
};

// Helper function to validate plan data
export const validatePlanData = (plan: any): plan is Plan => {
  return (
    plan &&
    typeof plan === "object" &&
    typeof plan.id === "string" &&
    typeof plan.name === "string" &&
    typeof plan.price === "number" &&
    plan.price > 0
  );
};

// Helper function to get plan by ID from multiple sources
export const findPlanById = (
  planId: string,
  availablePlans?: Plan[]
): Plan | null => {
  if (!planId) return null;

  // First try available plans (backend data)
  if (availablePlans?.length) {
    const plan = availablePlans.find((p) => p.id === planId);
    if (plan && validatePlanData(plan)) {
      return plan;
    }
  }

  // Fallback to static plans
  const staticPlan = MEAL_PLANS.find((p) => p.id === planId);
  if (staticPlan && validatePlanData(staticPlan)) {
    return staticPlan;
  }

  return null;
};

// Calculate monthly cost breakdown
export const calculateMonthlyCostBreakdown = (
  planId: string,
  mealTypesCount: number,
  deliveryDaysCount: number,
  availablePlans?: Plan[]
) => {
  const plan = findPlanById(planId, availablePlans);
  if (!plan) {
    return {
      isValid: false,
      plan: null,
      dailyCost: 0,
      weeklyCost: 0,
      monthlyCost: 0,
      breakdown: null,
    };
  }

  const dailyCost = plan.price * mealTypesCount;
  const weeklyCost = dailyCost * deliveryDaysCount;
  const monthlyCost = Math.round(weeklyCost * 4.3);

  return {
    isValid: true,
    plan,
    dailyCost,
    weeklyCost,
    monthlyCost,
    breakdown: {
      basePricePerMeal: plan.price,
      mealsPerDay: mealTypesCount,
      daysPerWeek: deliveryDaysCount,
      weeksPerMonth: 4.3,
      calculation: `${plan.price.toLocaleString()} × ${mealTypesCount} × ${deliveryDaysCount} × 4.3 = ${monthlyCost.toLocaleString()}`,
    },
  };
};

// Validate form data for pricing
export const validatePricingFormData = (data: {
  planId: string;
  mealTypesCount: number;
  deliveryDaysCount: number;
  availablePlans?: Plan[];
}) => {
  const errors: string[] = [];

  if (!data.planId) {
    errors.push("Paket makanan belum dipilih");
  }

  if (data.mealTypesCount <= 0) {
    errors.push("Minimal pilih 1 waktu makan");
  }

  if (data.deliveryDaysCount <= 0) {
    errors.push("Minimal pilih 1 hari pengiriman");
  }

  const plan = findPlanById(data.planId, data.availablePlans);
  if (data.planId && !plan) {
    errors.push("Paket yang dipilih tidak valid");
  }

  return {
    isValid: errors.length === 0,
    errors,
    plan,
  };
};

// Format currency for Indonesian locale
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format currency without "Rp" prefix
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};
