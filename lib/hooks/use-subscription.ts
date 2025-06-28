// lib/hooks/use-subscription.ts (Updated with enhanced notifications)
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

export function useSubscription(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await subscriptionService.getMy();

      if (response.success && response.data) {
        const convertedSubscriptions = response.data.map(
          convertSubscriptionFromBackend
        );
        setSubscriptions(convertedSubscriptions);
      } else {
        notifications.error({
          title: "Gagal memuat langganan 😔",
          description: response.error || "Terjadi kesalahan saat memuat data",
          action: {
            label: "Coba Lagi",
            onClick: () => fetchSubscriptions(),
          },
        });
      }
    } catch (error) {
      notifications.networkError();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  const createSubscription = async (data: CreateSubscriptionFormData) => {
    // Show loading notification with promise
    const createPromise = async () => {
      const backendData = convertSubscriptionFormData(data);
      const response = await subscriptionService.create(backendData);

      if (!response.success) {
        throw new Error(response.error || "Gagal membuat langganan");
      }

      return response.data;
    };

    try {
      setLoading(true);

      const result = await notifications.promise(createPromise(), {
        loading: "Membuat langganan baru...",
        success: "Yeay! Langganan berhasil dibuat! 🎉",
        error: (error) => error.message,
      });

      // Additional success notification with action
      notifications.success({
        title: "Langganan berhasil dibuat! 🎉",
        description:
          "Tim kami akan segera menghubungi kamu untuk konfirmasi pembayaran dan pengiriman pertama.",
        duration: 6000,
        action: {
          label: "Lihat Detail",
          onClick: () => {
            // Navigate to subscription detail or refresh list
            fetchSubscriptions();
          },
        },
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      // Error already handled by promise notification
      return false;
    } finally {
      setLoading(false);
    }
  };

  const pauseSubscription = async (id: string, pauseUntil?: Date) => {
    const pausePromise = async () => {
      const startDate = new Date().toISOString();
      const endDate =
        pauseUntil?.toISOString() ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default 30 days

      const response = await subscriptionService.pause(id, {
        start_date: startDate,
        end_date: endDate,
      });

      if (!response.success) {
        throw new Error(response.error || "Gagal menjeda langganan");
      }

      return response;
    };

    try {
      setLoading(true);

      await notifications.promise(pausePromise(), {
        loading: "Menjeda langganan...",
        success: "Langganan berhasil dijeda! ⏸️",
        error: (error) => error.message,
      });

      notifications.info({
        title: "Langganan dijeda",
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

    const cancelPromise = async () => {
      const response = await subscriptionService.cancel(id);

      if (!response.success) {
        throw new Error(response.error || "Gagal membatalkan langganan");
      }

      return response;
    };

    try {
      setLoading(true);

      await notifications.promise(cancelPromise(), {
        loading: "Membatalkan langganan...",
        success: "Langganan berhasil dibatalkan",
        error: (error) => error.message,
      });

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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reactivateSubscription = async (id: string) => {
    const reactivatePromise = async () => {
      const response = await subscriptionService.resume(id);

      if (!response.success) {
        throw new Error(response.error || "Gagal mengaktifkan langganan");
      }

      return response;
    };

    try {
      setLoading(true);

      await notifications.promise(reactivatePromise(), {
        loading: "Mengaktifkan kembali langganan...",
        success: "Selamat datang kembali! 🎉",
        error: (error) => error.message,
      });

      notifications.success({
        title: "Langganan aktif lagi! 🎉",
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (
    id: string,
    data: Partial<CreateSubscriptionData>
  ) => {
    const updatePromise = async () => {
      const response = await subscriptionService.update(id, data);

      if (!response.success) {
        throw new Error(response.error || "Gagal memperbarui langganan");
      }

      return response;
    };

    try {
      setLoading(true);

      await notifications.promise(updatePromise(), {
        loading: "Memperbarui langganan...",
        success: "Langganan berhasil diperbarui! ✅",
        error: (error) => error.message,
      });

      notifications.info({
        title: "Perubahan tersimpan",
        description: "Perubahan akan berlaku pada pengiriman berikutnya.",
      });

      await fetchSubscriptions();
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Bulk operations
  const pauseAllSubscriptions = async (pauseUntil?: Date) => {
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active"
    );

    if (activeSubscriptions.length === 0) {
      notifications.warning({
        title: "Tidak ada langganan aktif",
        description: "Tidak ada langganan yang bisa dijeda saat ini",
      });
      return false;
    }

    const confirmed = await new Promise<boolean>((resolve) => {
      notifications.warning({
        title: `Jeda ${activeSubscriptions.length} langganan? 🤔`,
        description: "Semua langganan aktif akan dijeda bersamaan",
        duration: 10000,
        action: {
          label: "Ya, Jeda Semua",
          onClick: () => resolve(true),
        },
      });

      setTimeout(() => resolve(false), 10000);
    });

    if (!confirmed) return false;

    try {
      setLoading(true);
      const results = await Promise.allSettled(
        activeSubscriptions.map((sub) => pauseSubscription(sub.id, pauseUntil))
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - successful;

      if (successful > 0) {
        notifications.success({
          title: `${successful} langganan berhasil dijeda`,
          description:
            failed > 0 ? `${failed} langganan gagal dijeda` : undefined,
        });
      }

      if (failed > 0) {
        notifications.error({
          title: `${failed} langganan gagal dijeda`,
          description: "Coba jeda satu per satu untuk langganan yang gagal",
        });
      }

      return successful > 0;
    } catch (error) {
      notifications.error({
        title: "Gagal menjeda langganan",
        description: "Terjadi kesalahan saat menjeda langganan secara massal",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    loading,
    createSubscription,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
    updateSubscription,
    pauseAllSubscriptions,
    refetch: fetchSubscriptions,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active"),
    pausedSubscriptions: subscriptions.filter((s) => s.status === "paused"),
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.status === "cancelled"
    ),
  };
}
