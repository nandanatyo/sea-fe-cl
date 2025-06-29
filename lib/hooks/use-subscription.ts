// lib/hooks/use-subscription.ts - Fixed version
import { useState, useEffect } from "react";
import {
  subscriptionService,
  type CreateSubscriptionData,
  type PauseSubscriptionData,
} from "@/lib/api/subscriptions";
import { notifications } from "@/lib/utils/notifications";
import {
  Subscription,
  convertSubscriptionFromBackend,
  convertSubscriptionFormData,
  CreateSubscriptionFormData,
} from "@/lib/types";

// Helper function to safely extract error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message && typeof error.message === "string") return error.message;
  if (error?.error && typeof error.error === "string") return error.error;
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors
      .map((e: any) => (typeof e === "string" ? e : e.message || "Error"))
      .join(", ");
  }
  return "Terjadi kesalahan yang tidak diketahui";
};

// Helper function to safely create date
const createSafeDate = (input?: Date | string | number): Date => {
  if (!input) {
    return new Date();
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? new Date() : input;
  }

  try {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
};

// Helper function to format date for Indonesian locale
const formatDateID = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Tanggal tidak valid";
  }
};

export function useSubscription(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    if (!userId) {
      console.log("📝 No userId provided, skipping subscription fetch");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📝 Fetching subscriptions for user:", userId);

      const response = await subscriptionService.getMy();

      console.log("📝 Raw subscription response:", response);

      if (response.success) {
        let subscriptionData = response.data;

        console.log("📝 Response data:", subscriptionData);

        // Handle different response formats from backend
        if (subscriptionData && typeof subscriptionData === "object") {
          if (Array.isArray(subscriptionData)) {
            console.log(
              "📝 Data is direct array, length:",
              subscriptionData.length
            );
          } else if (
            subscriptionData.subscriptions &&
            Array.isArray(subscriptionData.subscriptions)
          ) {
            console.log("📝 Data is wrapped in subscriptions field");
            subscriptionData = subscriptionData.subscriptions;
          } else if (
            subscriptionData.items &&
            Array.isArray(subscriptionData.items)
          ) {
            console.log("📝 Data is wrapped in items field");
            subscriptionData = subscriptionData.items;
          } else if (
            subscriptionData.data &&
            Array.isArray(subscriptionData.data)
          ) {
            console.log("📝 Data is nested in data field");
            subscriptionData = subscriptionData.data;
          } else if (!Array.isArray(subscriptionData) && subscriptionData.id) {
            console.log("📝 Data is single object, wrapping in array");
            subscriptionData = [subscriptionData];
          } else {
            console.log(
              "📝 Data is empty or unknown format, defaulting to empty array"
            );
            subscriptionData = [];
          }
        } else {
          console.log("📝 Data is null/undefined, defaulting to empty array");
          subscriptionData = [];
        }

        if (Array.isArray(subscriptionData)) {
          const convertedSubscriptions = subscriptionData.map(
            convertSubscriptionFromBackend
          );
          setSubscriptions(convertedSubscriptions);
          setError(null);

          console.log(
            "📝 Subscriptions loaded successfully:",
            convertedSubscriptions.length
          );
        } else {
          console.error("📝 Final data is not an array:", subscriptionData);
          setSubscriptions([]);
          setError("Format data tidak valid");
        }
      } else {
        const errorMessage = getErrorMessage(response.error || response);
        console.log("📝 API error:", errorMessage);

        if (
          errorMessage.includes("network") ||
          errorMessage.includes("fetch")
        ) {
          setError("Koneksi bermasalah");
        } else if (
          errorMessage.includes("401") ||
          errorMessage.includes("unauthorized")
        ) {
          setError("Sesi login berakhir");
        } else {
          setError("Gagal memuat data langganan");
        }
      }
    } catch (error) {
      console.error("📝 Subscription fetch error:", error);

      const errorMessage = getErrorMessage(error);

      if (errorMessage.includes("map")) {
        console.error("📝 Data format error - data is not an array");
        setError("Format data tidak sesuai");
      } else if (errorMessage.includes("fetch")) {
        setError("Koneksi bermasalah");
      } else {
        setError("Gagal memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  const createSubscription = async (data: CreateSubscriptionFormData) => {
    try {
      setLoading(true);

      const backendData = convertSubscriptionFormData(data);
      console.log("📝 Creating subscription with data:", backendData);

      const response = await subscriptionService.create(backendData);

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      console.log("📝 Subscription created successfully:", response.data);

      notifications.success({
        title: "Yeay! Langganan berhasil dibuat! 🎉",
        description:
          "Tim kami akan segera menghubungi kamu untuk konfirmasi pembayaran dan pengiriman pertama.",
        duration: 6000,
        action: {
          label: "Lihat Detail",
          onClick: () => {
            fetchSubscriptions();
          },
        },
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("📝 Create subscription error:", error);

      const errorMessage = getErrorMessage(error);

      notifications.error({
        title: "Gagal membuat langganan 😔",
        description: errorMessage,
        action: {
          label: "Coba Lagi",
          onClick: () => {
            console.log("Retry create subscription");
          },
        },
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const pauseSubscription = async (id: string, pauseUntil?: Date) => {
    try {
      setLoading(true);

      // Current date and time
      const now = new Date();

      // Set start_date to tomorrow (current time + 24 hours)
      const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now

      const endDate = pauseUntil
        ? new Date(pauseUntil)
        : new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Minimal 1 hari dari start_date

      // Validate dates
      if (!startDate || isNaN(startDate.getTime())) {
        throw new Error("Tanggal mulai tidak valid");
      }

      if (!endDate || isNaN(endDate.getTime())) {
        throw new Error("Tanggal berakhir tidak valid");
      }

      // Ensure endDate is after startDate
      if (endDate <= startDate) {
        throw new Error("Tanggal berakhir harus setelah tanggal mulai");
      }

      // Ensure minimum duration (at least 24 hours from startDate)
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24) {
        throw new Error("Durasi pause minimal 24 jam");
      }

      // Format tanggal dalam UTC ISO string (seperti format sukses di log)
      // Backend expects: "2025-06-30T12:12:44.612144Z"

      const pauseData: PauseSubscriptionData = {
        start_date: startDate.toISOString(), // Use startDate here
        end_date: endDate.toISOString(),
      };

      console.log("📝 Pause subscription request:", {
        subscriptionId: id,
        pauseData,
        startDisplay: formatDateID(startDate), // Display startDate
        endDisplay: formatDateID(endDate),
        durationHours: diffHours,
        durationDays: Math.ceil(diffHours / 24),
      });

      const response = await subscriptionService.pause(id, pauseData);

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      notifications.success({
        title: "Langganan berhasil dijeda! ⏸️",
        description: `Langganan akan otomatis aktif lagi pada ${formatDateID(
          endDate
        )}`,
        duration: 6000,
        action: {
          label: "Aktifkan Sekarang",
          onClick: () => reactivateSubscription(id),
        },
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("📝 Pause subscription error:", error);

      const errorMessage = getErrorMessage(error);

      // Handle specific errors
      if (
        errorMessage.includes("invalid pause dates") ||
        errorMessage.includes("Invalid pause dates") ||
        errorMessage.includes("toISOString")
      ) {
        notifications.error({
          title: "Format tanggal tidak valid ❌",
          description:
            "Terjadi masalah dengan format tanggal. Coba pilih tanggal yang berbeda.",
          action: {
            label: "Coba Lagi",
            onClick: () => {
              console.log("Retry pause subscription");
            },
          },
        });
      } else if (
        errorMessage.includes("duration") ||
        errorMessage.includes("future") ||
        errorMessage.includes("setelah")
      ) {
        notifications.error({
          title: "Tanggal tidak valid ⏰",
          description: errorMessage,
        });
      } else {
        notifications.error({
          title: "Gagal menjeda langganan",
          description: errorMessage,
          action: {
            label: "Hubungi Support",
            onClick: () => window.open("https://wa.me/08123456789", "_blank"),
          },
        });
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (id: string) => {
    // Show confirmation before canceling
    const confirmed = confirm(
      "Apakah kamu yakin ingin membatalkan langganan ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmed) return false;

    try {
      setLoading(true);

      const response = await subscriptionService.cancel(id);

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      notifications.warning({
        title: "Langganan dibatalkan 😢",
        description:
          "Kami sedih kamu pergi. Semoga bisa kembali lagi suatu saat nanti!",
        duration: 6000,
        action: {
          label: "Buat Langganan Baru",
          onClick: () => {
            window.location.href = "/subscription";
          },
        },
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("📝 Cancel subscription error:", error);

      const errorMessage = getErrorMessage(error);
      notifications.error({
        title: "Gagal membatalkan langganan",
        description: errorMessage,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const reactivateSubscription = async (id: string) => {
    try {
      setLoading(true);

      const response = await subscriptionService.resume(id);

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      notifications.success({
        title: "Selamat datang kembali! 🎉",
        description:
          "Pengiriman akan dimulai pada jadwal berikutnya. Siap lanjut hidup sehat!",
        action: {
          label: "Lihat Jadwal",
          onClick: () => {
            console.log("Show delivery schedule");
          },
        },
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("📝 Reactivate subscription error:", error);

      const errorMessage = getErrorMessage(error);
      notifications.error({
        title: "Gagal mengaktifkan langganan",
        description: errorMessage,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (
    id: string,
    data: Partial<CreateSubscriptionData>
  ) => {
    try {
      setLoading(true);

      const response = await subscriptionService.update(id, data);

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      notifications.success({
        title: "Langganan berhasil diperbarui! ✅",
        description: "Perubahan akan berlaku pada pengiriman berikutnya.",
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      console.error("📝 Update subscription error:", error);

      const errorMessage = getErrorMessage(error);
      notifications.error({
        title: "Gagal memperbarui langganan",
        description: errorMessage,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    loading,
    error,
    createSubscription,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
    updateSubscription,
    refetch: fetchSubscriptions,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active"),
    pausedSubscriptions: subscriptions.filter((s) => s.status === "paused"),
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.status === "cancelled"
    ),
  };
}
