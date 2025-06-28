import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { ApiResponse, PaginatedResponse } from "@/lib/types";
import { notifications } from "@/lib/utils/notifications";

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
      const response = await apiClient.get<MealPlan[]>(
        API_ENDPOINTS.MEAL_PLANS.SEARCH,
        {
          q: params.q,
          limit: params.limit?.toString() || "10",
        }
      );

      if (response.success && response.data) {
        notifications.success({
          title: `Ditemukan ${response.data.length} paket makanan! 🔍`,
          description: `Hasil pencarian untuk "${params.q}"`,
          duration: 3000,
        });
      }

      return response;
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
      const response = await apiClient.post<MealPlan>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BASE,
        data
      );

      if (response.success && response.data) {
        notifications.operationSuccess.mealPlanCreated(response.data.name);
      }

      return response;
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
      const response = await apiClient.put<MealPlan>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BY_ID(id),
        data
      );

      if (response.success && response.data) {
        notifications.operationSuccess.mealPlanUpdated(response.data.name);
      }

      return response;
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
      const response = await apiClient.delete<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BY_ID(id)
      );

      if (response.success) {
        notifications.success({
          title: "Paket makanan berhasil dihapus! 🗑️",
          description: "Paket telah dihapus dari sistem",
          duration: 4000,
        });
      }

      return response;
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
      const response = await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.ACTIVATE(id)
      );

      if (response.success) {
        notifications.success({
          title: "Paket makanan diaktifkan! ✅",
          description: "Paket sekarang tersedia untuk pelanggan",
          duration: 4000,
        });
      }

      return response;
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
      const response = await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.DEACTIVATE(id)
      );

      if (response.success) {
        notifications.success({
          title: "Paket makanan dinonaktifkan! ⏸️",
          description: "Paket tidak lagi tersedia untuk pelanggan baru",
          duration: 4000,
        });
      }

      return response;
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
      const response = await apiClient.patch<void>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.BULK_STATUS,
        data
      );

      if (response.success) {
        const action = data.is_active ? "activated" : "deactivated";
        notifications.operationSuccess.bulkStatusUpdated(
          data.ids.length,
          action
        );
      }

      return response;
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
      const response = await apiClient.get<MealPlanStats>(
        API_ENDPOINTS.MEAL_PLANS.ADMIN.STATS
      );

      if (response.success) {
        notifications.success({
          title: "Statistik paket makanan dimuat! 📊",
          description: "Data statistik terbaru telah ditampilkan",
          duration: 3000,
        });
      }

      return response;
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

  // Additional utility methods
  async duplicateMealPlan(id: string): Promise<ApiResponse<MealPlan>> {
    try {
      // First get the meal plan
      const getMealPlan = await this.getById(id);
      if (!getMealPlan.success || !getMealPlan.data) {
        return {
          success: false,
          error: "Meal plan not found",
        };
      }

      // Create a duplicate with modified name
      const originalPlan = getMealPlan.data;
      const duplicateData: CreateMealPlanData = {
        name: `${originalPlan.name} (Copy)`,
        description: originalPlan.description,
        price: originalPlan.price,
        image_url: originalPlan.image_url,
        features: [...originalPlan.features],
      };

      const response = await this.create(duplicateData);

      if (response.success) {
        notifications.success({
          title: "Paket makanan berhasil diduplikasi! 📋",
          description: `Salinan dari ${originalPlan.name} telah dibuat`,
          duration: 4000,
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to duplicate meal plan",
      };
    }
  },

  async importMealPlans(
    data: CreateMealPlanData[]
  ): Promise<ApiResponse<void>> {
    try {
      const results = await Promise.allSettled(
        data.map((planData) => this.create(planData))
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;

      const failed = data.length - successful;

      if (successful > 0) {
        notifications.operationSuccess.dataImported(successful);
      }

      if (failed > 0) {
        notifications.error({
          title: `${failed} paket gagal diimpor`,
          description: "Beberapa paket tidak dapat diproses",
        });
      }

      return {
        success: successful > 0,
        message: `${successful} paket berhasil diimpor${
          failed > 0 ? `, ${failed} gagal` : ""
        }`,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to import meal plans",
      };
    }
  },

  async exportMealPlans(): Promise<ApiResponse<MealPlan[]>> {
    try {
      const response = await this.getAll({ limit: 1000 }); // Get all meal plans

      if (response.success) {
        notifications.operationSuccess.dataExported("Meal Plans");
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to export meal plans",
      };
    }
  },
};
