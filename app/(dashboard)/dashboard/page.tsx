// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { PageLoading } from "@/components/common/loading/page-loading";
import { StatsOverview } from "@/components/dashboard/user/stats-overview";
import { SubscriptionList } from "@/components/dashboard/user/subscription-list";
import { EmptySubscriptions } from "@/components/dashboard/user/empty-subscriptions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, requireAuth } = useAuth();
  const { toast } = useToast();
  const {
    subscriptions,
    loading,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
    updateSubscription,
    refetch,
  } = useSubscription(user?.id);

  useEffect(() => {
    if (!requireAuth()) return;

    // Show welcome message for new users
    if (user && subscriptions.length === 0 && !loading) {
      const hasShownWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasShownWelcome) {
        setTimeout(() => {
          toast({
            title: `Selamat datang, ${user.name || user.fullName}! 🎉`,
            description:
              "Yuk mulai hidup sehat dengan membuat langganan pertama kamu!",
          });
          localStorage.setItem(`welcome_shown_${user.id}`, "true");
        }, 1000);
      }
    }
  }, [requireAuth, user, subscriptions.length, loading, toast]);

  const handlePauseSubscription = async (id: string) => {
    const success = await pauseSubscription(id);
    if (success) {
      await refetch();
    }
  };

  const handleCancelSubscription = async (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin membatalkan langganan ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (confirmed) {
      const success = await cancelSubscription(id);
      if (success) {
        await refetch();
      }
    }
  };

  const handleReactivateSubscription = async (id: string) => {
    const success = await reactivateSubscription(id);
    if (success) {
      await refetch();
    }
  };

  if (loading) {
    return <PageLoading message="Memuat dashboard kamu..." />;
  }

  if (!user) {
    return null;
  }

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );
  const pausedSubscriptions = subscriptions.filter(
    (s) => s.status === "paused"
  );
  const cancelledSubscriptions = subscriptions.filter(
    (s) => s.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Halo, {user.name || user.fullName}! 👋
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Selamat datang di dashboard pribadi kamu
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/subscription")}>
              <Plus className="h-4 w-4 mr-2" />
              Langganan Baru
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/user/profile")}>
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview subscriptions={subscriptions} />
        </div>

        {/* Active Subscriptions */}
        <Card className="shadow-2xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Langganan Aktif Kamu 🍽️</span>
              {activeSubscriptions.length > 0 && (
                <span className="text-lg opacity-90">
                  {activeSubscriptions.length} langganan
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {activeSubscriptions.length === 0 ? (
              <EmptySubscriptions />
            ) : (
              <SubscriptionList
                subscriptions={activeSubscriptions}
                onPause={handlePauseSubscription}
                onCancel={handleCancelSubscription}
                onReactivate={handleReactivateSubscription}
                type="active"
              />
            )}
          </CardContent>
        </Card>

        {/* Paused Subscriptions */}
        {pausedSubscriptions.length > 0 && (
          <Card className="shadow-2xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Langganan Dijeda ⏸️</span>
                <span className="text-lg opacity-90">
                  {pausedSubscriptions.length} langganan
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-orange-800 text-sm">
                  💡 <strong>Tips:</strong> Langganan yang dijeda akan otomatis
                  aktif kembali sesuai tanggal yang kamu tentukan. Atau kamu
                  bisa mengaktifkan kembali kapan saja dengan klik tombol
                  "Aktifkan Lagi".
                </p>
              </div>
              <SubscriptionList
                subscriptions={pausedSubscriptions}
                onReactivate={handleReactivateSubscription}
                type="paused"
              />
            </CardContent>
          </Card>
        )}

        {/* Cancelled Subscriptions */}
        {cancelledSubscriptions.length > 0 && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Riwayat Langganan 📋</span>
                <span className="text-lg opacity-90">
                  {cancelledSubscriptions.length} langganan
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 text-sm">
                  📝 <strong>Info:</strong> Ini adalah riwayat langganan yang
                  sudah dibatalkan. Kamu masih bisa mengaktifkan kembali
                  langganan ini dengan paket yang sama.
                </p>
              </div>
              <SubscriptionList
                subscriptions={cancelledSubscriptions}
                onReactivate={handleReactivateSubscription}
                type="cancelled"
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for users with subscriptions */}
        {subscriptions.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🚀 Aksi Cepat
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/subscription")}
                  className="h-16 flex-col gap-2">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Tambah Langganan</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/testimonial")}
                  className="h-16 flex-col gap-2">
                  <span className="text-xl">💬</span>
                  <span className="text-sm">Tulis Testimoni</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/contact")}
                  className="h-16 flex-col gap-2">
                  <span className="text-xl">📞</span>
                  <span className="text-sm">Hubungi Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
