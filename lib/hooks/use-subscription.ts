// lib/hooks/use-subscription.ts - Fixed to prevent object rendering
import { useState, useEffect } from "react";
import {
  subscriptionService,
  type CreateSubscriptionData,
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

      // Use silent error handling to avoid showing network error notifications
      const response = await subscriptionService.getMy();

      console.log("📝 Raw subscription response:", response);

      if (response.success) {
        // Handle different response formats from backend
        let subscriptionData = response.data;

        console.log("📝 Response data:", subscriptionData);
        console.log("📝 Data type:", typeof subscriptionData);
        console.log("📝 Is array:", Array.isArray(subscriptionData));

        // Handle case where data might be wrapped in another object
        if (subscriptionData && typeof subscriptionData === "object") {
          // Case 1: data is directly an array
          if (Array.isArray(subscriptionData)) {
            console.log(
              "📝 Data is direct array, length:",
              subscriptionData.length
            );
          }
          // Case 2: data is wrapped (e.g., { subscriptions: [...] })
          else if (
            subscriptionData.subscriptions &&
            Array.isArray(subscriptionData.subscriptions)
          ) {
            console.log("📝 Data is wrapped in subscriptions field");
            subscriptionData = subscriptionData.subscriptions;
          }
          // Case 3: data has items field (pagination format)
          else if (
            subscriptionData.items &&
            Array.isArray(subscriptionData.items)
          ) {
            console.log("📝 Data is wrapped in items field");
            subscriptionData = subscriptionData.items;
          }
          // Case 4: data has data field (nested data)
          else if (
            subscriptionData.data &&
            Array.isArray(subscriptionData.data)
          ) {
            console.log("📝 Data is nested in data field");
            subscriptionData = subscriptionData.data;
          }
          // Case 5: single object, wrap in array
          else if (!Array.isArray(subscriptionData) && subscriptionData.id) {
            console.log("📝 Data is single object, wrapping in array");
            subscriptionData = [subscriptionData];
          }
          // Case 6: empty object or null
          else {
            console.log(
              "📝 Data is empty or unknown format, defaulting to empty array"
            );
            subscriptionData = [];
          }
        } else {
          // Data is null, undefined, or primitive - default to empty array
          console.log("📝 Data is null/undefined, defaulting to empty array");
          subscriptionData = [];
        }

        // Ensure we have an array before mapping
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
        // Handle API errors
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

      // Handle different types of errors safely
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

      // Show success notification
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

      // Refresh subscriptions list
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
            // Could retry or just log
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

      const startDate = new Date().toISOString();
      const endDate =
        pauseUntil?.toISOString() ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default 30 days

      const response = await subscriptionService.pause(id, {
        start_date: startDate,
        end_date: endDate,
      });

      if (!response.success) {
        const errorMessage = getErrorMessage(response.error || response);
        throw new Error(errorMessage);
      }

      notifications.success({
        title: "Langganan berhasil dijeda! ⏸️",
        description: pauseUntil
          ? `Langganan akan otomatis aktif lagi pada ${pauseUntil.toLocaleDateString(
              "id-ID"
            )}`
          : "Langganan akan otomatis aktif lagi dalam 30 hari",
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
      notifications.error({
        title: "Gagal menjeda langganan",
        description: errorMessage,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (id: string) => {
    // Show confirmation before canceling
    const confirmed = await new Promise<boolean>((resolve) => {
      notifications.warning({
        title: "Yakin ingin membatalkan? 🤔",
        description:
          "Langganan yang dibatalkan tidak dapat dikembalikan. Kamu bisa membuat langganan baru kapan saja.",
        duration: 10000,
        action: {
          label: "Ya, Batalkan",
          onClick: () => resolve(true),
        },
      });

      // Also show alternative action
      setTimeout(() => {
        notifications.info({
          title: "Atau jeda saja dulu? 💭",
          description:
            "Jika kamu hanya butuh istirahat sebentar, coba jeda langganan aja",
          action: {
            label: "Jeda Saja",
            onClick: () => {
              resolve(false);
              pauseSubscription(id);
            },
          },
        });
      }, 2000);

      // Auto resolve to false after 15 seconds
      setTimeout(() => resolve(false), 15000);
    });

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
            // Navigate to delivery schedule
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
