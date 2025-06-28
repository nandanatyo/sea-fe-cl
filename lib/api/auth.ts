// lib/api/auth.ts - Updated to use access token only
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { User, ApiResponse } from "@/lib/types";

export interface LoginData {
  phone?: string; // Backend uses phone for login
  email?: string; // Support both email and phone
  password: string;
}

export interface RegisterData {
  name: string; // Backend uses 'name' instead of 'fullName'
  phone: string;
  password: string;
  email: string;
}

export interface RegisterFormData {
  fullName: string; // Frontend form field
  phone: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}

export interface SendOTPData {
  email: string;
  type: "email_verification" | "password_reset";
}

export interface VerifyOTPData {
  email: string;
  otp: string;
  type: "email_verification" | "password_reset";
}

export interface ForgotPasswordData {
  phone: string;
}

export interface ResetPasswordData {
  phone: string;
  otp: string;
  new_password: string;
}

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

      if (response.success && response.data) {
        // Store only access token and user data
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        // Auto login after registration - store access token only
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  },

  async sendOTP(data: SendOTPData): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(API_ENDPOINTS.AUTH.SEND_OTP, data);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send OTP",
      };
    }
  },

  async verifyOTP(data: VerifyOTPData): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      };
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process forgot password",
      };
    }
  },

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password reset failed",
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      this.removeAuthToken();
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  },

  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  },

  removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Remove refresh token storage since we're not using it anymore
      localStorage.removeItem("refresh_token");
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  },

  // Validate token (you can extend this to check expiration)
  validateToken(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();

    if (!token || !user) {
      this.removeAuthToken();
      return false;
    }

    // Add token expiration check here if backend provides exp claim
    try {
      // Basic validation - you can enhance this
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        this.removeAuthToken();
        return false;
      }
      return true;
    } catch {
      this.removeAuthToken();
      return false;
    }
  },
};
