// components/common/error-boundary.tsx
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
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Send error to notification
    notifications.error({
      title: "Terjadi kesalahan aplikasi",
      description: "Halaman akan dimuat ulang secara otomatis",
      action: {
        label: "Muat Ulang",
        onClick: () => window.location.reload(),
      },
    });
  }

  public render() {
    if (this.state.hasError) {
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

              {process.env.NODE_ENV === "development" && (
                <div className="bg-gray-100 p-3 rounded text-left text-xs text-gray-700 max-h-32 overflow-auto">
                  <strong>Error:</strong> {this.state.error?.message}
                  <br />
                  <strong>Stack:</strong> {this.state.error?.stack}
                </div>
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
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
