"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Badge
      variant={isOnline ? "default" : "destructive"}
      className={`fixed bottom-4 right-4 z-50 ${
        isOnline ? "bg-green-600" : "bg-red-600"
      }`}>
      {isOnline ? (
        <Wifi className="h-3 w-3 mr-1" />
      ) : (
        <WifiOff className="h-3 w-3 mr-1" />
      )}
      {isOnline ? "Online" : "Offline"}
    </Badge>
  );
}
