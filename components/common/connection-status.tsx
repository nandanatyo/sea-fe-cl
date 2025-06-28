// components/common/connection-status.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { notifications } from "@/lib/utils/notifications";

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      notifications.success({
        title: "Koneksi kembali! 🌐",
        description: "Internet kamu sudah terhubung kembali",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      notifications.error({
        title: "Koneksi terputus! 📶",
        description: "Periksa koneksi internet kamu",
        duration: 8000,
        action: {
          label: "Coba Lagi",
          onClick: () => window.location.reload(),
        },
      });
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Don't show anything if online
  if (isOnline && !showOfflineBanner) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 p-4">
      <Card className="max-w-md mx-auto bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <WifiOff className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Tidak ada koneksi</h3>
              <p className="text-sm text-red-600">
                Beberapa fitur mungkin tidak berfungsi dengan baik
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-100">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// components/common/network-status-indicator.tsx

// components/common/retry-button.tsx

// components/common/error-fallback.tsx

// components/common/api-error-handler.tsx

// Hook for API error handling
// hooks/use-api-error.ts
