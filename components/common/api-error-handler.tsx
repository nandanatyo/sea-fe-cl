"use client";

import { useEffect } from "react";
import { notifications } from "@/lib/utils/notifications";

interface ApiErrorHandlerProps {
  error: any;
  context?: string;
  onRetry?: () => void;
}

export function ApiErrorHandler({
  error,
  context,
  onRetry,
}: ApiErrorHandlerProps) {
  useEffect(() => {
    if (!error) return;

    const errorMessage = error?.message || error?.error || "Terjadi kesalahan";
    const contextMessage = context ? ` saat ${context}` : "";

    // Determine error type and show appropriate notification
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
        action: onRetry
          ? {
              label: "Coba Lagi",
              onClick: onRetry,
            }
          : undefined,
      });
    }
  }, [error, context, onRetry]);

  return null;
}
