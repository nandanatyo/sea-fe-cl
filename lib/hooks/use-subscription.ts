// lib/hooks/use-subscription.ts
import { useState, useEffect } from "react";
import {
  subscriptionService,
  type CreateSubscriptionData,
} from "@/lib/api/subscriptions";
import { useToast } from "@/hooks/use-toast";
import {
  Subscription,
  convertSubscriptionFromBackend,
  convertSubscriptionFormData,
  CreateSubscriptionFormData,
} from "@/lib/types";

export function useSubscription(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Gagal memuat langganan 😔",
          description: response.error || "Terjadi kesalahan saat memuat data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal memuat langganan 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
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

      // Convert frontend form data to backend format
      const backendData = convertSubscriptionFormData(data);

      const response = await subscriptionService.create(backendData);

      if (response.success && response.data) {
        toast({
          title: "Yeay! Langganan berhasil dibuat! 🎉",
          description:
            "Tim kami akan segera menghubungi kamu untuk konfirmasi.",
        });

        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Waduh, ada kendala teknis 😔",
          description:
            response.error || "Terjadi kesalahan saat membuat langganan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Waduh, ada kendala teknis 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
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

      if (response.success) {
        toast({
          title: "Langganan berhasil dijeda! ⏸️",
          description:
            "Langganan akan otomatis aktif lagi sesuai tanggal yang dipilih.",
        });

        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Gagal menjeda langganan 😔",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal menjeda langganan 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  };

  const cancelSubscription = async (id: string) => {
    try {
      setLoading(true);

      const response = await subscriptionService.cancel(id);

      if (response.success) {
        toast({
          title: "Langganan dibatalkan 😢",
          description:
            "Kami sedih kamu pergi. Semoga bisa kembali lagi suatu saat nanti!",
        });

        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Gagal membatalkan langganan 😔",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal membatalkan langganan 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  };

  const reactivateSubscription = async (id: string) => {
    try {
      setLoading(true);

      const response = await subscriptionService.resume(id);

      if (response.success) {
        toast({
          title: "Selamat datang kembali! 🎉",
          description: "Langganan sudah aktif lagi. Siap lanjut hidup sehat!",
        });

        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Gagal mengaktifkan langganan 😔",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal mengaktifkan langganan 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateSubscription = async (
    id: string,
    data: Partial<CreateSubscriptionData>
  ) => {
    try {
      setLoading(true);

      const response = await subscriptionService.update(id, data);

      if (response.success) {
        toast({
          title: "Langganan berhasil diperbarui! ✅",
          description: "Perubahan akan berlaku pada pengiriman berikutnya.",
        });

        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Gagal memperbarui langganan 😔",
          description: response.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal memperbarui langganan 😔",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    updateSubscription,
    refetch: fetchSubscriptions,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active"),
    pausedSubscriptions: subscriptions.filter((s) => s.status === "paused"),
    cancelledSubscriptions: subscriptions.filter(
      (s) => s.status === "cancelled"
    ),
  };
}
