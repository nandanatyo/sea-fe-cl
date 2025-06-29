// components/common/error-boundary.tsx - Fixed to prevent object rendering
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { notifications } from "@/lib/utils/notifications";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Helper function to safely get error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error?.message && typeof error.message === "string") return error.message;
  return "Terjadi kesalahan yang tidak diketahui";
};

// Helper function to safely get error stack
const getErrorStack = (error: any): string => {
  if (error instanceof Error && error.stack) return error.stack;
  if (error?.stack && typeof error.stack === "string") return error.stack;
  return "Stack trace tidak tersedia";
};

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Send error to notification with safe message extraction
    const errorMessage = getErrorMessage(error);

    setTimeout(() => {
      notifications.error({
        title: "Terjadi kesalahan aplikasi",
        description: "Halaman akan dimuat ulang secara otomatis",
        action: {
          label: "Muat Ulang",
          onClick: () => window.location.reload(),
        },
      });
    }, 100);

    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = getErrorMessage(this.state.error);
      const errorStack = getErrorStack(this.state.error);

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Oops! Ada yang tidak beres 😅
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Terjadi kesalahan yang tidak terduga. Jangan khawatir, tim kami
                akan segera memperbaikinya!
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-gray-100 p-3 rounded text-left text-xs max-h-32 overflow-auto">
                  <summary className="cursor-pointer font-medium">
                    Error Details (Dev Mode)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Message:</strong> {errorMessage}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-xs">
                        {errorStack}
                      </pre>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1 text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Muat Ulang Halaman
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}>
                  Kembali ke Beranda
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                Jika masalah terus berlanjut, hubungi support kami di{" "}
                <a
                  href="mailto:hello@seacatering.id"
                  className="text-emerald-600 hover:underline">
                  hello@seacatering.id
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
