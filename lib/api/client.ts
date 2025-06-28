// lib/api/client.ts - Enhanced with better response format handling
import { ApiResponse } from "@/lib/types";
import { notifications } from "@/lib/utils/notifications";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

    console.log("🌐 API Client initialized with base URL:", this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Check network connectivity first
    if (typeof window !== "undefined" && !navigator.onLine) {
      const errorResponse = {
        success: false,
        error: "Tidak ada koneksi internet",
      };

      if (showErrorNotification) {
        notifications.networkError();
      }

      return errorResponse;
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);
      console.log(`🌐 Request headers:`, config.headers);

      if (config.body) {
        console.log(`🌐 Request body:`, config.body);
      }

      const response = await fetch(url, config);

      console.log(`🌐 API Response: ${response.status} ${response.statusText}`);
      console.log(
        `🌐 Response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      // Handle non-JSON responses (e.g., 204 No Content)
      if (response.status === 204) {
        return {
          success: true,
          data: null as T,
          message: "Success",
        };
      }

      let data;
      let rawResponseText = "";

      try {
        // Get raw response text first for debugging
        rawResponseText = await response.text();
        console.log(`🌐 Raw response text:`, rawResponseText);

        // Try to parse as JSON
        if (rawResponseText) {
          data = JSON.parse(rawResponseText);
          console.log(`🌐 Parsed response data:`, data);
        } else {
          data = null;
        }
      } catch (parseError) {
        console.error("🌐 Failed to parse response as JSON:", parseError);
        console.error("🌐 Raw response was:", rawResponseText);

        const errorResponse = {
          success: false,
          error: `Server response tidak valid (${
            response.status
          }): ${rawResponseText.substring(0, 100)}`,
        };

        if (showErrorNotification) {
          notifications.error({
            title: "Server bermasalah 🔧",
            description: "Response server tidak bisa dibaca",
          });
        }

        return errorResponse;
      }

      if (!response.ok) {
        const errorResponse = {
          success: false,
          error: data?.error || data?.message || `HTTP ${response.status}`,
        };

        console.error(`🌐 API Error: ${response.status}`, data);

        // Show appropriate error notification based on status code
        if (showErrorNotification) {
          this.handleErrorNotification(response.status, errorResponse.error);
        }

        return errorResponse;
      }

      // Handle different response formats from backend
      let responseData = data;

      // Backend might return data in different formats:
      // 1. Direct data: { "id": "123", "name": "..." }
      // 2. Wrapped in data field: { "data": [...], "message": "success" }
      // 3. Wrapped with metadata: { "data": [...], "meta": {...}, "message": "success" }

      if (data && typeof data === "object") {
        // If response has a 'data' field, use that as the main data
        if (data.data !== undefined) {
          responseData = data.data;
          console.log(`🌐 Extracted data from response.data:`, responseData);
        }
        // If response has items field (pagination)
        else if (data.items !== undefined) {
          responseData = data.items;
          console.log(`🌐 Extracted data from response.items:`, responseData);
        }
        // Otherwise use the entire response as data
        else {
          responseData = data;
          console.log(`🌐 Using entire response as data:`, responseData);
        }
      }

      const apiResponse = {
        success: true,
        data: responseData as T,
        message: data?.message || "Success",
      };

      console.log(`🌐 Final API Response:`, apiResponse);

      return apiResponse;
    } catch (error) {
      console.error("🌐 API Request failed:", error);

      let errorMessage = "Network error occurred";
      let isNetworkError = false;

      if (error instanceof TypeError) {
        if (error.message.includes("fetch")) {
          errorMessage = "Gagal terhubung ke server";
          isNetworkError = true;
        } else if (error.message.includes("NetworkError")) {
          errorMessage = "Koneksi internet bermasalah";
          isNetworkError = true;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      const errorResponse = {
        success: false,
        error: errorMessage,
      };

      if (showErrorNotification) {
        if (isNetworkError) {
          notifications.networkError();
        } else {
          notifications.error({
            title: "Terjadi kesalahan",
            description: errorResponse.error,
          });
        }
      }

      return errorResponse;
    }
  }

  private handleErrorNotification(statusCode: number, errorMessage: string) {
    switch (statusCode) {
      case 400:
        notifications.validationError(errorMessage);
        break;
      case 401:
        // Clear invalid token and show unauthorized message
        this.clearAuthToken();
        notifications.unauthorized();
        break;
      case 403:
        notifications.permissionDenied();
        break;
      case 404:
        notifications.error({
          title: "Data tidak ditemukan 🔍",
          description: "Data yang kamu cari tidak tersedia",
        });
        break;
      case 409:
        notifications.error({
          title: "Konflik data ⚠️",
          description: errorMessage || "Data sudah ada atau sedang digunakan",
        });
        break;
      case 422:
        notifications.validationError(errorMessage);
        break;
      case 429:
        notifications.quotaExceeded();
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        notifications.serverError();
        break;
      default:
        notifications.error({
          title: "Terjadi kesalahan",
          description: errorMessage,
        });
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private clearAuthToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
  }

  // Public methods with optional error notification control
  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url, { method: "GET" }, showErrorNotification);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      showErrorNotification
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      showErrorNotification
    );
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      showErrorNotification
    );
  }

  async delete<T>(
    endpoint: string,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      { method: "DELETE" },
      showErrorNotification
    );
  }

  // For file uploads
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: "POST",
      body: formData,
      headers: {},
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorResponse = {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };

        if (showErrorNotification) {
          this.handleErrorNotification(response.status, errorResponse.error);
        }

        return errorResponse;
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error("File upload failed:", error);

      const errorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };

      if (showErrorNotification) {
        notifications.error({
          title: "Upload gagal",
          description: errorResponse.error,
        });
      }

      return errorResponse;
    }
  }
}

export const apiClient = new ApiClient();
