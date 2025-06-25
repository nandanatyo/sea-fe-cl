"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { PageLoading } from "@/components/common/loading/page-loading";
import { StatsOverview } from "@/components/dashboard/user/stats-overview";
import { SubscriptionList } from "@/components/dashboard/user/subscription-list";
import { EmptySubscriptions } from "@/components/dashboard/user/empty-subscriptions";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, requireAuth } = useAuth();
  const {
    subscriptions,
    loading,
    pauseSubscription,
    cancelSubscription,
    reactivateSubscription,
  } = useSubscription(user?.id);

  useEffect(() => {
    if (!requireAuth()) return;
  }, [requireAuth]);

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
              Halo, {user.fullName}! 👋
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Selamat datang di dashboard pribadi kamu
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/subscription")}>
              <Settings className="h-4 w-4 mr-2" />
              Langganan Baru
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
            <CardTitle className="text-2xl">Langganan Aktif Kamu 🍽️</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {activeSubscriptions.length === 0 ? (
              <EmptySubscriptions />
            ) : (
              <SubscriptionList
                subscriptions={activeSubscriptions}
                onPause={pauseSubscription}
                onCancel={cancelSubscription}
                onReactivate={reactivateSubscription}
                type="active"
              />
            )}
          </CardContent>
        </Card>

        {/* Paused Subscriptions */}
        {pausedSubscriptions.length > 0 && (
          <Card className="shadow-2xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Langganan Dijeda ⏸️</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <SubscriptionList
                subscriptions={pausedSubscriptions}
                onReactivate={reactivateSubscription}
                type="paused"
              />
            </CardContent>
          </Card>
        )}

        {/* Cancelled Subscriptions */}
        {cancelledSubscriptions.length > 0 && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Riwayat Langganan 📋</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <SubscriptionList
                subscriptions={cancelledSubscriptions}
                onReactivate={reactivateSubscription}
                type="cancelled"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
