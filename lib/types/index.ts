export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  createdAt: string;
  updatedAt: string;
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

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  phone: string;
  plan: string;
  planName: string;
  mealTypes: string[];
  deliveryDays: string[];
  totalPrice: number;
  allergies?: string;
  address: string;
  city: string;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
  updatedAt: string;
  pauseUntil?: string;
  cancelledAt?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  email: string;
  plan: string;
  reviewMessage: string;
  rating: number;
  location: string;
  approved: boolean;
  createdAt: string;
}

export interface AdminMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  subscriptionGrowth: number;
  totalActiveSubscriptions: number;
  totalUsers: number;
  conversionRate: number;
  churnRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
