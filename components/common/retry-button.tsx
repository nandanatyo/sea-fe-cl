// components/common/retry-button.tsx - Fixed to prevent object rendering
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  className?: string;
}

// Helper to safely handle retry function
const safeRetry = async (
  retryFn: () => Promise<void> | void
): Promise<void> => {
  try {
    const result = retryFn();
    if (result instanceof Promise) {
      await result;
    }
  } catch (error) {
    console.error("Retry function failed:", error);
    // Don't throw the error to prevent component crashes
  }
};

export function RetryButton({
  onRetry,
  children = "Coba Lagi",
  variant = "outline",
  size = "default",
  disabled = false,
  className = "",
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying || disabled) return;

    try {
      setIsRetrying(true);
      await safeRetry(onRetry);
    } catch (error) {
      console.error("Retry failed:", error);
      // Error is already handled in safeRetry
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRetry}
      disabled={disabled || isRetrying}
      className={`gap-2 ${className}`}>
      {isRetrying ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {typeof children === "string" ? children : "Coba Lagi"}
    </Button>
  );
}
