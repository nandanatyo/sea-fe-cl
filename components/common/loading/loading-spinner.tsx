// components/common/loading/loading-spinner.tsx
("use client");

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600",
        sizeClasses[size],
        className
      )}
    />
  );
}

// components/common/error/error-message.tsx
("use client");

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorMessage({
  title = "Terjadi Kesalahan",
  message = "Silakan coba lagi dalam beberapa saat",
  onRetry,
  showRetry = true,
  className,
}: ErrorMessageProps) {
  return (
    <Card className={cn("border-red-200 bg-red-50", className)}>
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// lib/utils/error-reporting.ts
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private reports: ErrorReport[] = [];

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  report(error: Error, context?: Record<string, any>, userId?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      userId,
      context,
    };

    this.reports.push(report);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      this.sendToErrorService(report);
    } else {
      console.error("Error Report:", report);
    }
  }

  private async sendToErrorService(report: ErrorReport) {
    try {
      // Replace with your error tracking service endpoint
      await fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch (err) {
      console.error("Failed to send error report:", err);
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }
}
