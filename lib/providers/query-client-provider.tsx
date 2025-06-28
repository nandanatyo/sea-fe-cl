// lib/providers/query-client-provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time before data is considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Time data stays in cache
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on 401/403 errors
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Don't refetch on window focus for auth queries
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect for auth queries
            refetchOnReconnect: false,
          },
          mutations: {
            // Global error handling for mutations
            onError: (error: any) => {
              console.error("Mutation error:", error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// app/layout.tsx - Updated to include QueryProvider
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { ClientErrorHandler } from "@/components/common/client-error-handler";
import { ConnectionStatus } from "@/components/common/connection-status";
import { NetworkStatusIndicator } from "@/components/common/network-status-indicator";
import { QueryProvider } from "@/lib/providers/query-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEA Catering - Healthy Meals, Anytime, Anywhere",
  description:
    "Indonesia's premier customizable healthy meal delivery service. Fresh, nutritious meals delivered across major cities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ErrorBoundary>
            <ClientErrorHandler />
            <ConnectionStatus />
            <Navigation />
            <main>{children}</main>
            <Footer />
            <NetworkStatusIndicator />

            {/* Enhanced Toaster with custom styling */}
            <Toaster
              position="top-right"
              richColors
              expand={true}
              closeButton
              toastOptions={{
                style: {
                  background: "white",
                  color: "black",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow:
                    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                },
                className: "custom-toast",
                duration: 4000,
              }}
            />
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
