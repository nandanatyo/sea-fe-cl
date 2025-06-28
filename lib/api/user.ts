// lib/api/user.ts - Updated with success notifications
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { User, ApiResponse } from "@/lib/types";
import { notifications } from "@/lib/utils/notifications";

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
      const response = await apiClient.put<User>(
        API_ENDPOINTS.USER.PROFILE,
        data
      );

      if (response.success) {
        notifications.operationSuccess.profileUpdated();

        // Update localStorage with new user data
        if (response.data) {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = { ...currentUser, ...response.data };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      return response;
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
      const response = await apiClient.post<void>(
        API_ENDPOINTS.USER.CHANGE_PASSWORD,
        data
      );

      if (response.success) {
        notifications.operationSuccess.passwordChanged();
      }

      return response;
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

      const response = await apiClient.uploadFile<User>(
        API_ENDPOINTS.USER.UPLOAD_IMAGE,
        formData
      );

      if (response.success) {
        notifications.operationSuccess.profileImageUploaded();

        // Update localStorage with new user data including image URL
        if (response.data) {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = { ...currentUser, ...response.data };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      return response;
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

  // Email verification
  async sendEmailVerification(): Promise<ApiResponse<void>> {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) {
        return {
          success: false,
          error: "Email tidak ditemukan",
        };
      }

      const response = await apiClient.post<void>("/auth/send-otp", {
        email: user.email,
        type: "email_verification",
      });

      if (response.success) {
        notifications.success({
          title: "Email verifikasi dikirim! 📧",
          description: `Link verifikasi telah dikirim ke ${user.email}`,
          duration: 5000,
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send email verification",
      };
    }
  },

  async verifyEmail(otp: string): Promise<ApiResponse<void>> {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) {
        return {
          success: false,
          error: "Email tidak ditemukan",
        };
      }

      const response = await apiClient.post<void>("/auth/verify-otp", {
        email: user.email,
        otp,
        type: "email_verification",
      });

      if (response.success) {
        notifications.success({
          title: "Email berhasil diverifikasi! ✅",
          description: "Akun kamu sekarang sudah terverifikasi",
          duration: 5000,
        });

        // Update user verification status in localStorage
        const updatedUser = { ...user, email_verified: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to verify email",
      };
    }
  },

  // Account deletion
  async deleteAccount(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>("/user/profile");

      if (response.success) {
        notifications.success({
          title: "Akun berhasil dihapus! 👋",
          description: "Semua data kamu telah dihapus dari sistem kami",
          duration: 6000,
        });

        // Clear all localStorage data
        localStorage.clear();

        // Redirect to home page after a delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete account",
      };
    }
  },

  // Export user data (GDPR compliance)
  async exportUserData(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<any>("/user/export");

      if (response.success) {
        notifications.operationSuccess.dataExported("User Data");
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to export user data",
      };
    }
  },

  // Privacy settings
  async updatePrivacySettings(settings: {
    marketing_emails?: boolean;
    data_sharing?: boolean;
    analytics?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<void>("/user/privacy", settings);

      if (response.success) {
        notifications.operationSuccess.settingsUpdated();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update privacy settings",
      };
    }
  },

  // Notification preferences
  async updateNotificationSettings(settings: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    push_notifications?: boolean;
    delivery_reminders?: boolean;
    promotional_offers?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<void>(
        "/user/notifications",
        settings
      );

      if (response.success) {
        notifications.success({
          title: "Preferensi notifikasi diperbarui! 🔔",
          description: "Pengaturan notifikasi telah disimpan",
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
            : "Failed to update notification settings",
      };
    }
  },
};
