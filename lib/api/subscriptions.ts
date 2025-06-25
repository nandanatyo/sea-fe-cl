import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { Subscription, ApiResponse } from "@/lib/types";

export interface CreateSubscriptionData {
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

export const subscriptionService = {
  async create(
    data: CreateSubscriptionData
  ): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS.BASE, data);
  },

  async getAll(): Promise<ApiResponse<Subscription[]>> {
    return apiClient.get<Subscription[]>(API_ENDPOINTS.SUBSCRIPTIONS.BASE);
  },

  async getUserSubscriptions(
    userId: string
  ): Promise<ApiResponse<Subscription[]>> {
    return apiClient.get<Subscription[]>(
      `${API_ENDPOINTS.SUBSCRIPTIONS.BASE}?userId=${userId}`
    );
  },

  async pause(id: string, pauseUntil: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.SUBSCRIPTIONS.PAUSE(id), {
      pauseUntil,
    });
  },

  async cancel(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL(id));
  },

  async reactivate(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.SUBSCRIPTIONS.REACTIVATE(id));
  },
};
