// lib/api/admin.ts - Fixed to handle backend response structure
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

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
  };
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
  // Admin authentication - Fixed to handle correct backend response structure
  async login(
    data: AdminLoginData
  ): Promise<ApiResponse<{ user: User; access_token: string }>> {
    try {
      console.log("🔐 Admin login attempt:", { email: data.email });

      const response = await apiClient.post<AdminLoginResponse>(
        API_ENDPOINTS.ADMIN.LOGIN,
        data
      );

      console.log("🔐 Raw admin login response:", response);

      if (response.success && response.data) {
        const backendData = response.data;
        console.log("🔐 Backend data:", backendData);

        // Validate response structure
        if (!backendData.admin) {
          console.error("🔐 No admin object in response:", backendData);
          return {
            success: false,
            error: "Response server tidak mengandung data admin",
          };
        }

        if (!backendData.access_token) {
          console.error("🔐 No access_token in response:", backendData);
          return {
            success: false,
            error: "Token akses tidak ditemukan dalam response",
          };
        }

        // Transform admin object to user object
        const user: User = {
          id: backendData.admin.id,
          name: backendData.admin.name,
          fullName: backendData.admin.name,
          email: backendData.admin.email,
          role: backendData.admin.role as "admin" | "user",
          is_active: true,
          email_verified: true,
          created_at: backendData.admin.created_at,
          updated_at: backendData.admin.created_at, // Use created_at as fallback
        };

        console.log("🔐 Transformed user:", user);

        // Verify that the user is actually an admin
        if (user.role !== "admin") {
          console.error("🔐 User is not an admin:", user.role);
          return {
            success: false,
            error: "Akses admin ditolak - user bukan admin",
          };
        }

        const transformedResponse = {
          user,
          access_token: backendData.access_token,
        };

        console.log(
          "🔐 Admin login successful, returning:",
          transformedResponse
        );

        return {
          success: true,
          data: transformedResponse,
          message: "Admin login successful",
        };
      } else {
        console.error("🔐 Admin login response not successful:", response);
        return {
          success: false,
          error: response.error || "Admin login failed",
        };
      }
    } catch (error) {
      console.error("🔐 Admin login error:", error);
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

  // Admin testimonial management
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
