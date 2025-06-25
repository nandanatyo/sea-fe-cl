import { useState, useEffect } from "react";
import {
  subscriptionService,
  type CreateSubscriptionData,
} from "@/lib/api/subscriptions";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "@/lib/types";

export function useSubscription(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await subscriptionService.getUserSubscriptions(userId);

      if (response.success && response.data) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      toast({
        title: "Gagal memuat langganan 😔",
        description: "Coba refresh halaman ya!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  const createSubscription = async (data: CreateSubscriptionData) => {
    try {
      setLoading(true);
      const response = await subscriptionService.create(data);

      if (response.success) {
        toast({
          title: "Yeay! Langganan berhasil dibuat! 🎉",
          description:
            "Tim kami akan segera menghubungi kamu untuk konfirmasi.",
        });

        await fetchSubscriptions();
        return true;
      }
    } catch (error) {
      toast({
        title: "Waduh, ada kendala teknis 😔",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  };

  const pauseSubscription = async (id: string, pauseUntil: Date) => {
    try {
      const response = await subscriptionService.pause(
        id,
        pauseUntil.toISOString()
      );

      if (response.success) {
        toast({
          title: "Langganan berhasil dijeda! ⏸️",
          description:
            "Langganan akan otomatis aktif lagi sesuai tanggal yang dipilih.",
        });

        await fetchSubscriptions();
        return true;
      }
    } catch (error) {
      toast({
        title: "Gagal menjeda langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
    return false;
  };

  const cancelSubscription = async (id: string) => {
    try {
      const response = await subscriptionService.cancel(id);

      if (response.success) {
        toast({
          title: "Langganan dibatalkan 😢",
          description:
            "Kami sedih kamu pergi. Semoga bisa kembali lagi suatu saat nanti!",
        });

        await fetchSubscriptions();
        return true;
      }
    } catch (error) {
      toast({
        title: "Gagal membatalkan langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
    return false;
  };

  const reactivateSubscription = async (id: string) => {
    try {
      const response = await subscriptionService.reactivate(id);

      if (response.success) {
        toast({
          title: "Selamat datang kembali! 🎉",
          description: "Langganan sudah aktif lagi. Siap lanjut hidup sehat!",
        });

        await fetchSubscriptions();
        return true;
      }
    } catch (error) {
      toast({
        title: "Gagal mengaktifkan langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
    return false;
  };

  return {
    subscriptions,
    loading,
    createSubscription,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
    refetch: fetchSubscriptions,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active"),
    pausedSubscriptions: subscriptions.filter((s) => s.status === "paused"),
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.status === "cancelled"
    ),
  };
}
