// lib/api/auth.ts - Updated for better token management and debugging
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { User, ApiResponse } from "@/lib/types";

export interface LoginData {
  phone?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  password: string;
  email: string;
}

export interface RegisterFormData {
  fullName: string;
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
      console.log("🔐 Login attempt:", {
        email: data.email,
        phone: data.phone,
      });

      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

      console.log("🔐 Login response:", {
        success: response.success,
        hasData: !!response.data,
        hasToken: !!response.data?.access_token,
        hasUser: !!response.data?.user,
      });

      if (response.success && response.data) {
        // Store access token and user data
        this.setAuthToken(response.data.access_token);
        this.setCurrentUser(response.data.user);

        console.log("🔐 Stored auth data successfully");
      }

      return response;
    } catch (error) {
      console.error("🔐 Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log("📝 Register attempt:", {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      console.log("📝 Register response:", {
        success: response.success,
        hasData: !!response.data,
        hasToken: !!response.data?.access_token,
        hasUser: !!response.data?.user,
        message: response.message,
      });

      if (response.success && response.data) {
        // Auto login after registration - store access token only
        this.setAuthToken(response.data.access_token);
        this.setCurrentUser(response.data.user);

        console.log("📝 Stored auth data after registration");
      }

      return response;
    } catch (error) {
      console.error("📝 Register error:", error);
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

  // Token management methods
  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      console.log("🔑 Token stored:", token.substring(0, 20) + "...");
    }
  },

  setCurrentUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("👤 User stored:", {
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  },

  removeAuthToken(): void {
    if (typeof window === "undefined") return;

    console.log("🗑️ Removing auth data");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token"); // Clean up old refresh token if exists
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (user) {
        console.log("👤 Retrieved user:", {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } else {
        console.log("👤 No user found in localStorage");
      }

      return user;
    } catch (error) {
      console.error("👤 Error parsing user data:", error);
      this.removeAuthToken();
      return null;
    }
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("access_token");

    if (token) {
      console.log("🔑 Retrieved token:", token.substring(0, 20) + "...");
    } else {
      console.log("🔑 No token found in localStorage");
    }

    return token;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const hasToken = !!this.getAccessToken();
    const hasUser = !!this.getCurrentUser();
    const isValid = this.validateToken();

    console.log("🔍 Auth check:", { hasToken, hasUser, isValid });

    return hasToken && hasUser && isValid;
  },

  // Validate token (enhanced with better error handling)
  validateToken(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();

    if (!token || !user) {
      console.log("❌ Validation failed: missing token or user");
      this.removeAuthToken();
      return false;
    }

    try {
      // Basic JWT validation
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        console.log("❌ Validation failed: invalid JWT format");
        this.removeAuthToken();
        return false;
      }

      // Decode payload to check expiration
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.log("❌ Validation failed: token expired");
        this.removeAuthToken();
        return false;
      }

      console.log("✅ Token validation successful");
      return true;
    } catch (error) {
      console.error("❌ Token validation error:", error);
      this.removeAuthToken();
      return false;
    }
  },

  // Get user info from token
  getTokenInfo(): any {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        userId: payload.user_id,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Debug method to check auth state
  debugAuthState(): void {
    console.log("🔍 === AUTH DEBUG ===");
    console.log("Token:", this.getAccessToken()?.substring(0, 20) + "...");
    console.log("User:", this.getCurrentUser());
    console.log("Token Info:", this.getTokenInfo());
    console.log("Is Authenticated:", this.isAuthenticated());
    console.log("==================");
  },
};
