import { useCallback } from "react";
import { notifications } from "@/lib/utils/notifications";

export function useApiError() {
  const handleError = useCallback((error: any, context?: string) => {
    const errorMessage = error?.message || error?.error || "Terjadi kesalahan";
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
