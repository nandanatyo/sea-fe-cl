// lib/api/admin.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  AdminMetrics,
  ApiResponse,
  User,
  PaginatedResponse,
} from "@/lib/types";

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface DashboardFilterData {
  start_date: string;
  end_date: string;
}

export interface UpdateUserStatusData {
  is_active: boolean;
  reason?: string;
}

export interface SearchUsersParams {
  page?: number;
  limit?: number;
  status?: "all" | "active" | "inactive";
  sort_by?: "created_at" | "name" | "email";
  sort_dir?: "asc" | "desc";
  search?: string;
}

export const adminService = {
  // Admin authentication
  async login(
    data: AdminLoginData
  ): Promise<ApiResponse<{ user: User; access_token: string }>> {
    try {
      const response = await apiClient.post<{
        user: User;
        access_token: string;
      }>(API_ENDPOINTS.ADMIN.LOGIN, data);

      if (response.success && response.data) {
        // Store access token and admin user data
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Admin login failed",
      };
    }
  },

  // Dashboard endpoints
  async getDashboard(): Promise<ApiResponse<AdminMetrics>> {
    try {
      return await apiClient.get<AdminMetrics>(API_ENDPOINTS.ADMIN.DASHBOARD);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      };
    }
  },

  async getDashboardWithFilter(
    data: DashboardFilterData
  ): Promise<ApiResponse<AdminMetrics>> {
    try {
      return await apiClient.post<AdminMetrics>(
        API_ENDPOINTS.ADMIN.DASHBOARD_FILTER,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch filtered dashboard data",
      };
    }
  },

  // User management endpoints
  async getAllUsers(
    params?: SearchUsersParams
  ): Promise<PaginatedResponse<User>> {
    try {
      const queryParams: Record<string, string> = {};

      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams[key] = value.toString();
        }
      });

      return await apiClient.get<User[]>(
        API_ENDPOINTS.USER_MANAGEMENT.ALL,
        queryParams
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>(API_ENDPOINTS.USER_MANAGEMENT.BY_ID(id));
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      };
    }
  },

  async updateUserStatus(
    id: string,
    data: UpdateUserStatusData
  ): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(
        API_ENDPOINTS.USER_MANAGEMENT.STATUS(id),
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      };
    }
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(
        API_ENDPOINTS.USER_MANAGEMENT.DELETE(id)
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      };
    }
  },

  // Admin testimonial management (legacy endpoints)
  async approveTestimonial(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(
        API_ENDPOINTS.ADMIN.TESTIMONIALS.APPROVE(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to approve testimonial",
      };
    }
  },

  async rejectTestimonial(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put<void>(
        API_ENDPOINTS.ADMIN.TESTIMONIALS.REJECT(id)
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject testimonial",
      };
    }
  },
};
