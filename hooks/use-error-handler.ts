import { useEffect } from "react";
import { notifications } from "@/lib/utils/notifications";

export function useErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);

      notifications.error({
        title: "Terjadi kesalahan",
        description:
          "Ada masalah dengan aplikasi. Tim kami sedang memperbaikinya.",
      });
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);

      notifications.error({
        title: "Terjadi kesalahan",
        description: "Ada masalah dengan aplikasi. Coba muat ulang halaman.",
        action: {
          label: "Muat Ulang",
          onClick: () => window.location.reload(),
        },
      });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);
}
