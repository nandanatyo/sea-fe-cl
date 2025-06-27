// lib/api/meal-plans.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { ApiResponse, PaginatedResponse } from "@/lib/types";

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

export interface CreateMealPlanData {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  features: string[];
}

export interface UpdateMealPlanData extends Partial<CreateMealPlanData> {}

export interface BulkStatusUpdateData {
  ids: string[];
  is_active: boolean;
}

export interface MealPlanStats {
  total_meal_plans: number;
  active_meal_plans: number;
  inactive_meal_plans: number;
  most_popular_plan: string;
}

export const mealPlansService = {
  // Public endpoints
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<MealPlan>> {
    try {
      return await apiClient.get<MealPlan[]>(API_ENDPOINTS.MEAL_PLANS.BASE, {
        page: params?.page?.toString() || "1",
        limit: params?.limit?.toString() || "10",
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch meal plans",
      };
    }
  },

  async getActive(): Promise<ApiResponse<MealPlan[]>> {
    try {
      return await apiClient.get<MealPlan[]>(API_ENDPOINTS.MEAL_PLANS.ACTIVE);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch active meal plans",
      };
    }
  },

  async getPopular(): Promise<ApiResponse<MealPlan[]>> {
    try {
      return await apiClient.get<MealPlan[]>(API_ENDPOINTS.MEAL_PLANS.POPULAR);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch popular meal plans",
      };
    }
  },

  async search(params: {
    q: string;
    limit?: number;
  }): Promise<ApiResponse<MealPlan[]>> {
    try {
      return await apiClient.get<MealPlan[]>(API_ENDPOINTS.MEAL_PLANS.SEARCH, {
        q: params.q,
        limit: params.limit?.toString() || "10",
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<MealPlan>> {
    try {
      return await apiClient.get<MealPlan>(API_ENDPOINTS.MEAL_PLANS.BY_ID(id));
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch meal plan",
      };
    }
  },

  // Admin endpoints
  async create(data: CreateMealPlanData): Promise<ApiResponse<MealPlan>> {
    try {
      return await apiClient.post<MealPlan>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BASE,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create meal plan",
      };
    }
  },

  async update(
    id: string,
    data: UpdateMealPlanData
  ): Promise<ApiResponse<MealPlan>> {
    try {
      return await apiClient.put<MealPlan>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BY_ID(id),
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update meal plan",
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BY_ID(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete meal plan",
      };
    }
  },

  async activate(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.ACTIVATE(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to activate meal plan",
      };
    }
  },

  async deactivate(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.DEACTIVATE(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to deactivate meal plan",
      };
    }
  },

  async bulkUpdateStatus(
    data: BulkStatusUpdateData
  ): Promise<ApiResponse<void>> {
    try {
      return await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BULK_STATUS,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update meal plan status",
      };
    }
  },

  async getStats(): Promise<ApiResponse<MealPlanStats>> {
    try {
      return await apiClient.get<MealPlanStats>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.STATS
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch meal plan stats",
      };
    }
  },
};
