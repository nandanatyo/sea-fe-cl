// lib/api/subscriptions.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { Subscription, ApiResponse, PaginatedResponse } from "@/lib/types";

export interface CreateSubscriptionData {
  name: string;
  phone_number: string;
  meal_plan_id: string;
  meal_types: string[];
  delivery_days: string[];
  allergies?: string;
}

export interface PauseSubscriptionData {
  start_date: string;
  end_date: string;
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  paused_subscriptions: number;
  cancelled_subscriptions: number;
  total_revenue: number;
  monthly_recurring_revenue: number;
  churn_rate: number;
  conversion_rate: number;
  reactivations: number;
}

export interface SearchSubscriptionsParams {
  page?: number;
  limit?: number;
  status?: "all" | "active" | "paused" | "cancelled";
  sort_by?: "created_at" | "updated_at" | "total_price";
  sort_dir?: "asc" | "desc";
  search?: string;
  user_id?: string;
  meal_plan_id?: string;
  min_price?: number;
  max_price?: number;
  date_from?: string;
  date_to?: string;
}

export interface ForceCancelData {
  reason: string;
  refund_amount?: number;
  notify_user?: boolean;
  admin_comments?: string;
}

export const subscriptionService = {
  // Public endpoints
  async create(
    data: CreateSubscriptionData
  ): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.post<Subscription>(
        API_ENDPOINTS.SUBSCRIPTIONS.BASE,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
      };
    }
  },

  async getMy(): Promise<ApiResponse<Subscription[]>> {
    try {
      return await apiClient.get<Subscription[]>(
        API_ENDPOINTS.SUBSCRIPTIONS.MY
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscriptions",
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.get<Subscription>(
        API_ENDPOINTS.SUBSCRIPTIONS.BY_ID(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscription",
      };
    }
  },

  async update(
    id: string,
    data: Partial<CreateSubscriptionData>
  ): Promise<ApiResponse<Subscription>> {
    try {
      return await apiClient.put<Subscription>(
        API_ENDPOINTS.SUBSCRIPTIONS.BY_ID(id),
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update subscription",
      };
    }
  },

  async pause(
    id: string,
    data: PauseSubscriptionData
  ): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(
        API_ENDPOINTS.SUBSCRIPTIONS.PAUSE(id),
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to pause subscription",
      };
    }
  },

  async resume(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(API_ENDPOINTS.SUBSCRIPTIONS.RESUME(id));
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to resume subscription",
      };
    }
  },

  async cancel(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(
        API_ENDPOINTS.SUBSCRIPTIONS.CANCEL(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
      };
    }
  },

  // Payment webhook (for backend integration)
  async processPaymentWebhook(data: any): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(
        API_ENDPOINTS.SUBSCRIPTIONS.WEBHOOK_PAYMENT,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process payment webhook",
      };
    }
  },

  // Admin endpoints
  async getStats(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<SubscriptionStats>> {
    try {
      return await apiClient.get<SubscriptionStats>(
        API_ENDPOINTS.SUBSCRIPTIONS.ADMIN.STATS,
        params
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscription stats",
      };
    }
  },

  async getAllAdmin(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Subscription>> {
    try {
      const queryParams = {
        page: params?.page?.toString() || "1",
        limit: params?.limit?.toString() || "10",
      };
      return await apiClient.get<Subscription[]>(
        API_ENDPOINTS.SUBSCRIPTIONS.ADMIN.ALL,
        queryParams
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscriptions",
      };
    }
  },

  async searchSubscriptions(
    params: SearchSubscriptionsParams
  ): Promise<PaginatedResponse<Subscription>> {
    try {
      const queryParams: Record<string, string> = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams[key] = value.toString();
        }
      });

      return await apiClient.get<Subscription[]>(
        API_ENDPOINTS.SUBSCRIPTIONS.ADMIN.SEARCH,
        queryParams
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search subscriptions",
      };
    }
  },

  async forceCancel(
    id: string,
    data: ForceCancelData
  ): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(
        API_ENDPOINTS.SUBSCRIPTIONS.ADMIN.FORCE_CANCEL(id),
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to force cancel subscription",
      };
    }
  },

  async processExpiredPauses(): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(
        API_ENDPOINTS.SUBSCRIPTIONS.ADMIN.PROCESS_EXPIRED
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process expired pauses",
      };
    }
  },
};
