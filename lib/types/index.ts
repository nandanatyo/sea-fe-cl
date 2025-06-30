// lib/types/index.ts
export interface User {
  id: string;
  name?: string; // Backend uses 'name'
  fullName?: string; // Frontend compatibility
  email: string;
  phone?: string;
  role: "admin" | "user";
  is_active?: boolean;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  description: string;
  image?: string;
  emoji: string;
  features: string[];
  sampleMenus: string[];
  calories: string;
  servings: string;
  prepTime: string;
  popular: boolean;
  badge: string;
}

// Backend meal plan structure
export interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id?: string;
  userId?: string; // Frontend compatibility
  name: string;
  phone_number?: string;
  phone?: string; // Frontend compatibility
  meal_plan_id: string;
  plan?: string; // Frontend compatibility
  planName?: string; // Frontend compatibility
  meal_types: string[];
  mealTypes?: string[]; // Frontend compatibility
  delivery_days: string[];
  deliveryDays?: string[]; // Frontend compatibility
  total_price?: number;
  totalPrice?: number; // Frontend compatibility
  allergies?: string;
  address?: string;
  city?: string;
  status: "active" | "paused" | "cancelled";
  created_at: string;
  createdAt?: string; // Frontend compatibility
  updated_at: string;
  updatedAt?: string; // Frontend compatibility
  pause_start?: string;
  pause_end?: string;
  pauseUntil?: string; // Frontend compatibility
  cancelled_at?: string;
  cancelledAt?: string; // Frontend compatibility
  next_delivery?: string;
  payment_status?: "pending" | "paid" | "failed";
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customerName?: string; // Frontend compatibility
  email: string;
  plan: string;
  message?: string;
  reviewMessage?: string; // Frontend compatibility
  rating: number;
  location: string;
  approved: boolean;
  is_approved?: boolean; // Backend field
  created_at: string;
  createdAt?: string; // Frontend compatibility
  updated_at?: string;
}

export interface AdminMetrics {
  total_users?: number;
  totalUsers?: number; // Frontend compatibility
  active_subscriptions: number;
  totalActiveSubscriptions?: number; // Frontend compatibility
  new_subscriptions: number;
  newSubscriptions?: number; // Frontend compatibility

  // Change from monthly_recurring_revenue to monthly_revenue to match backend
  monthly_revenue: number; // Backend field name
  monthlyRecurringRevenue?: number; // Keep for compatibility

  total_revenue?: number;
  reactivations?: number;
  subscription_growth?: number;
  subscription_growth_percentage?: number; // Backend field
  subscriptionGrowth?: number; // Frontend compatibility
  conversion_rate?: number;
  conversionRate?: number; // Frontend compatibility
  churn_rate?: number;
  churnRate?: number; // Frontend compatibility
  cancelled_subscriptions?: number;
  paused_subscriptions?: number;
  revenue_growth_percentage?: number; // Backend field
  pending_testimonials?: number; // Backend field
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  // Alternative pagination structure that might come from backend
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Payment webhook data structure
export interface PaymentWebhookData {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
}

// Form data types for better type safety
export interface CreateSubscriptionFormData {
  name: string;
  phone: string;
  plan: string;
  mealTypes: string[];
  deliveryDays: string[];
  allergies?: string;
  address: string;
  city: string;
  totalPrice: number;
}

// Convert frontend form data to backend API format
export const convertSubscriptionFormData = (
  formData: CreateSubscriptionFormData
) => ({
  name: formData.name,
  phone_number: formData.phone,
  meal_plan_id: formData.plan,
  meal_types: formData.mealTypes,
  delivery_days: formData.deliveryDays,
  allergies: formData.allergies || "",
});

// Convert backend subscription to frontend format
export const convertSubscriptionFromBackend = (
  subscription: any
): Subscription => ({
  ...subscription,
  userId: subscription.user_id,
  phone: subscription.phone_number,
  plan: subscription.meal_plan_id,
  mealTypes: subscription.meal_types,
  deliveryDays: subscription.delivery_days,
  totalPrice: subscription.total_price,
  createdAt: subscription.created_at,
  updatedAt: subscription.updated_at,
  pauseUntil: subscription.pause_end,
  cancelledAt: subscription.cancelled_at,
});

// Convert backend user to frontend format
export const convertUserFromBackend = (user: any): User => ({
  ...user,
  fullName: user.name || user.fullName,
});

// Convert backend testimonial to frontend format
export const convertTestimonialFromBackend = (
  testimonial: any
): Testimonial => ({
  ...testimonial,
  customerName: testimonial.customer_name,
  reviewMessage: testimonial.message,
  approved: testimonial.is_approved ?? testimonial.approved,
  createdAt: testimonial.created_at,
});
