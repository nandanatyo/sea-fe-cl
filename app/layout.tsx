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
      </body>
    </html>
  );
}
