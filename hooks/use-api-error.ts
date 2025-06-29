// hooks/use-api-error.ts - Fixed to prevent object rendering
import { useCallback } from "react";
import { notifications } from "@/lib/utils/notifications";

// Helper function to safely extract error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message && typeof error.message === "string") return error.message;
  if (error?.error && typeof error.error === "string") return error.error;
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors
      .map((e: any) => (typeof e === "string" ? e : e.message || "Error"))
      .join(", ");
  }
  if (error && typeof error === "object") {
    // Try to extract any meaningful error info from object
    const keys = Object.keys(error);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const firstValue = error[firstKey];
      if (typeof firstValue === "string") return firstValue;
    }
  }
  return "Terjadi kesalahan yang tidak diketahui";
};

export function useApiError() {
  const handleError = useCallback((error: any, context?: string) => {
    const errorMessage = getErrorMessage(error);
    const contextMessage = context ? ` saat ${context}` : "";

    console.error(`API Error${contextMessage}:`, error);

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      notifications.networkError();
    } else if (
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("401")
    ) {
      notifications.unauthorized();
    } else if (
      errorMessage.includes("forbidden") ||
      errorMessage.includes("403")
    ) {
      notifications.permissionDenied();
    } else if (
      errorMessage.includes("server") ||
      errorMessage.includes("500")
    ) {
      notifications.serverError();
    } else {
      notifications.error({
        title: `Terjadi kesalahan${contextMessage}`,
        description: errorMessage,
      });
    }
  }, []);

  const handleSuccess = useCallback((message: string, description?: string) => {
    notifications.success({
      title: message,
      description,
    });
  }, []);

  const handleWarning = useCallback((message: string, description?: string) => {
    notifications.warning({
      title: message,
      description,
    });
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
  };
}
