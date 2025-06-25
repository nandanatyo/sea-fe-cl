"use client";

import { Loader2 } from "lucide-react";

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function ButtonLoading({
  loading,
  children,
  loadingText = "Memproses...",
}: ButtonLoadingProps) {
  if (loading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}
      </>
    );
  }

  return <>{children}</>;
}
