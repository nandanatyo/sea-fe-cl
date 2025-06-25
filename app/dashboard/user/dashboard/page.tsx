"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { PageLoading } from "@/components/common/loading/page-loading";
import { StatsOverview } from "@/components/dashboard/user/stats-overview";
import { SubscriptionCard } from "@/components/dashboard/user/subscription-card";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout, requireAuth } = useAuth();
  const { subscriptions, loading, pauseSubscription, cancelSubscription } =
    useSubscription(user?.id);

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
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Langganan Aktif Kamu 🍽️</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {activeSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Langganan Aktif
                </h3>
                <p className="text-gray-600 mb-6">
                  Yuk mulai hidup sehat dengan berlangganan paket makanan kami!
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <a href="/subscription">🚀 Mulai Langganan</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onViewDetails={() => {
                      /* Handle view details */
                    }}
                    onPause={() =>
                      pauseSubscription(subscription.id, new Date())
                    }
                    onCancel={() => cancelSubscription(subscription.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
