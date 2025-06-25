import { useState, useEffect } from "react";
import {
  subscriptionService,
  type CreateSubscriptionData,
} from "@/lib/api/subscriptions";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "@/lib/types";

const mockSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    userId: "user-1",
    name: "John Doe",
    phone: "08123456789",
    plan: "protein",
    planName: "Protein Plan",
    mealTypes: ["breakfast", "lunch"],
    deliveryDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    totalPrice: 1720000,
    address: "Jl. Sudirman No. 123",
    city: "jakarta",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "sub-2",
    userId: "user-1",
    name: "John Doe",
    phone: "08123456789",
    plan: "diet",
    planName: "Diet Plan",
    mealTypes: ["lunch", "dinner"],
    deliveryDays: ["saturday", "sunday"],
    totalPrice: 1290000,
    address: "Jl. Sudirman No. 123",
    city: "jakarta",
    status: "paused",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    pauseUntil: "2024-02-01T10:00:00Z",
  },
];

export function useSubscription(userId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userSubscriptions = mockSubscriptions.filter(
        (sub) => sub.userId === userId
      );
      setSubscriptions(userSubscriptions);
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

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newSubscription: Subscription = {
        id: `sub-${Date.now()}`,
        userId: userId || "user-1",
        name: data.name,
        phone: data.phone,
        plan: data.plan,
        planName:
          data.plan.charAt(0).toUpperCase() + data.plan.slice(1) + " Plan",
        mealTypes: data.mealTypes,
        deliveryDays: data.deliveryDays,
        totalPrice: data.totalPrice,
        address: data.address,
        city: data.city,
        allergies: data.allergies,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSubscriptions.push(newSubscription);

      toast({
        title: "Yeay! Langganan berhasil dibuat! 🎉",
        description: "Tim kami akan segera menghubungi kamu untuk konfirmasi.",
      });

      await fetchSubscriptions();
      return true;
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

  const pauseSubscription = async (id: string, pauseUntil?: Date) => {
    try {
      const subscriptionIndex = mockSubscriptions.findIndex(
        (sub) => sub.id === id
      );
      if (subscriptionIndex !== -1) {
        mockSubscriptions[subscriptionIndex] = {
          ...mockSubscriptions[subscriptionIndex],
          status: "paused",
          pauseUntil:
            pauseUntil?.toISOString() ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      toast({
        title: "Langganan berhasil dijeda! ⏸️",
        description:
          "Langganan akan otomatis aktif lagi sesuai tanggal yang dipilih.",
      });

      await fetchSubscriptions();
      return true;
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
      const subscriptionIndex = mockSubscriptions.findIndex(
        (sub) => sub.id === id
      );
      if (subscriptionIndex !== -1) {
        mockSubscriptions[subscriptionIndex] = {
          ...mockSubscriptions[subscriptionIndex],
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      toast({
        title: "Langganan dibatalkan 😢",
        description:
          "Kami sedih kamu pergi. Semoga bisa kembali lagi suatu saat nanti!",
      });

      await fetchSubscriptions();
      return true;
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
      const subscriptionIndex = mockSubscriptions.findIndex(
        (sub) => sub.id === id
      );
      if (subscriptionIndex !== -1) {
        mockSubscriptions[subscriptionIndex] = {
          ...mockSubscriptions[subscriptionIndex],
          status: "active",
          pauseUntil: undefined,
          cancelledAt: undefined,
          updatedAt: new Date().toISOString(),
        };
      }

      toast({
        title: "Selamat datang kembali! 🎉",
        description: "Langganan sudah aktif lagi. Siap lanjut hidup sehat!",
      });

      await fetchSubscriptions();
      return true;
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
