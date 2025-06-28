// Client Error Handler Component
// components/common/client-error-handler.tsx
"use client";

import { useErrorHandler } from "@/hooks/use-error-handler";

export function ClientErrorHandler() {
  useErrorHandler();
  return null;
}
