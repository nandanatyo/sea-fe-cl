import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { User, ApiResponse } from "@/lib/types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Login gagal",
        };
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));

      return {
        success: true,
        data: {
          user: result.user,
          message: result.message,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      };
    }
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Registrasi gagal",
        };
      }

      return {
        success: true,
        data: {
          user: result.user,
          message: result.message,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      this.removeAuthToken();
      return {
        success: true,
        message: "Logout berhasil",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout gagal",
      };
    }
  },

  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  },

  removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
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
};
