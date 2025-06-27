// lib/api/user.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { User, ApiResponse } from "@/lib/types";

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const userService = {
  // User profile endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
      };
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      return await apiClient.put<User>(API_ENDPOINTS.USER.PROFILE, data);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  },

  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(
        API_ENDPOINTS.USER.CHANGE_PASSWORD,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to change password",
      };
    }
  },

  async uploadProfileImage(file: File): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      return await apiClient.uploadFile<User>(
        API_ENDPOINTS.USER.UPLOAD_IMAGE,
        formData
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload profile image",
      };
    }
  },
};
