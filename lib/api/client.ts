import { ApiResponse } from "@/lib/types";
import { notifications } from "@/lib/utils/notifications";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    showErrorNotification = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (e.g., 204 No Content)
      if (response.status === 204) {
        return {
          success: true,
          data: null as T,
          message: "Success",
        };
      }

      const data = await response.json();

      if (!response.ok) {
        const errorResponse = {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };

        // Show appropriate error notification based on status code
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
      console.error("API Request failed:", error);

      const errorResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };

      if (showErrorNotification) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
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

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.access_token || null;
      }
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
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
    const token = this.getAuthToken();
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
