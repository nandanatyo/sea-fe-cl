// components/common/error-fallback.tsx - Fixed to prevent object rendering
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { RetryButton } from "./retry-button";

interface ErrorFallbackProps {
  error?: Error | any;
  resetError?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
}

// Helper function to safely extract error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error?.message && typeof error.message === "string") return error.message;
  if (error?.error && typeof error.error === "string") return error.error;
  return "Terjadi kesalahan yang tidak diketahui";
};

// Helper function to safely extract error stack
const getErrorStack = (error: any): string => {
  if (error instanceof Error && error.stack) return error.stack;
  if (error?.stack && typeof error.stack === "string") return error.stack;
  return "Stack trace tidak tersedia";
};

export function ErrorFallback({
  error,
  resetError,
  title = "Oops! Terjadi kesalahan 😅",
  description = "Jangan khawatir, ini bukan salah kamu. Mari coba beberapa solusi:",
  showDetails = false,
}: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReload = () => {
    window.location.reload();
  };

  const errorMessage = getErrorMessage(error);
  const errorStack = getErrorStack(error);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">{description}</p>

          {showDetails && error && (
            <details className="bg-gray-100 p-3 rounded text-xs">
              <summary className="cursor-pointer font-medium mb-2">
                Detail Error (untuk developer)
              </summary>
              <div className="text-gray-700 max-h-32 overflow-auto">
                <div>
                  <strong>Message:</strong> {errorMessage}
                </div>
                <div className="mt-2">
                  <strong>Stack:</strong>
                </div>
                <pre className="whitespace-pre-wrap mt-1 text-xs">
                  {errorStack}
                </pre>
              </div>
            </details>
          )}

          <div className="space-y-3">
            <div className="flex gap-2">
              {resetError && (
                <RetryButton onRetry={resetError} className="flex-1">
                  Coba Lagi
                </RetryButton>
              )}
              <RetryButton onRetry={handleReload} className="flex-1">
                Muat Ulang
              </RetryButton>
            </div>

            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full gap-2">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Jika masalah terus terjadi, hubungi tim support kami di{" "}
            <a
              href="mailto:support@seacatering.id"
              className="text-emerald-600 hover:underline">
              support@seacatering.id
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
