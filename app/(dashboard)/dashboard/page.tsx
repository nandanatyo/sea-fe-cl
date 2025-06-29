// app/(dashboard)/dashboard/page.tsx - Fixed version
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut, Plus, RefreshCw, Wifi, WifiOff } from "lucide-react";
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
    error,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
    updateSubscription,
    refetch,
  } = useSubscription(user?.id);

  useEffect(() => {
    if (!requireAuth()) return;

    // Show welcome message for new users (only once)
    if (user && subscriptions.length === 0 && !loading && !error) {
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
  }, [requireAuth, user, subscriptions.length, loading, error, toast]);

  // Fixed pause handler to properly pass Date object
  const handlePauseSubscription = async (
    id: string,
    pauseUntil: Date
  ): Promise<boolean> => {
    console.log("🎯 UserDashboard handlePauseSubscription:", {
      id,
      pauseUntil,
      pauseUntilType: typeof pauseUntil,
      isValidDate: pauseUntil instanceof Date && !isNaN(pauseUntil.getTime()),
    });

    // Validate pauseUntil parameter
    if (!(pauseUntil instanceof Date) || isNaN(pauseUntil.getTime())) {
      console.error("🎯 Invalid pauseUntil in UserDashboard:", pauseUntil);
      toast({
        title: "Error",
        description: "Tanggal tidak valid",
        variant: "destructive",
      });
      return false;
    }

    try {
      const success = await pauseSubscription(id, pauseUntil);
      if (success) {
        await refetch();
      }
      return success;
    } catch (error) {
      console.error("🎯 Error in handlePauseSubscription:", error);
      toast({
        title: "Error",
        description: "Gagal menjeda langganan",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCancelSubscription = async (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin membatalkan langganan ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (confirmed) {
      try {
        const success = await cancelSubscription(id);
        if (success) {
          await refetch();
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        toast({
          title: "Error",
          description: "Gagal membatalkan langganan",
          variant: "destructive",
        });
      }
    }
  };

  const handleReactivateSubscription = async (id: string) => {
    try {
      const success = await reactivateSubscription(id);
      if (success) {
        await refetch();
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast({
        title: "Error",
        description: "Gagal mengaktifkan kembali langganan",
        variant: "destructive",
      });
    }
  };

  const handleRetry = async () => {
    await refetch();
  };

  // Show loading state
  if (loading && subscriptions.length === 0) {
    return <PageLoading message="Memuat dashboard kamu..." />;
  }

  // User not authenticated
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

        {/* Error State */}
        {error && (
          <Card className="shadow-lg border-0 mb-8 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {error.includes("Koneksi") ? (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-red-800">
                      {error.includes("Koneksi")
                        ? "Koneksi Bermasalah"
                        : "Gagal Memuat Data"}
                    </h3>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={loading}
                  className="border-red-300 text-red-700 hover:bg-red-50">
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        {!error && (
          <div className="mb-8">
            <StatsOverview subscriptions={subscriptions} />
          </div>
        )}

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
            {error ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  Tidak dapat memuat data langganan
                </div>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={loading}>
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Coba Lagi
                </Button>
              </div>
            ) : activeSubscriptions.length === 0 ? (
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
        {!error && pausedSubscriptions.length > 0 && (
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
        {!error && cancelledSubscriptions.length > 0 && (
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
        {!error && subscriptions.length > 0 && (
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

        {/* Network status indicator */}
        {!navigator.onLine && (
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-800">
                    Tidak ada koneksi internet
                  </h4>
                  <p className="text-red-600 text-sm">
                    Beberapa data mungkin tidak up-to-date. Periksa koneksi
                    internet kamu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
