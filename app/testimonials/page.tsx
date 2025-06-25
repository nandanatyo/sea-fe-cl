"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, X, Eye, Settings, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchSubscriptions(parsedUser.id);
  }, []);

  const fetchSubscriptions = async (userId: string) => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async (
    subscriptionId: string,
    pauseUntil: Date
  ) => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/pause`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pauseUntil: pauseUntil.toISOString() }),
        }
      );

      if (response.ok) {
        toast({
          title: "Langganan berhasil dijeda! ⏸️",
          description:
            "Langganan kamu akan otomatis aktif lagi sesuai tanggal yang dipilih.",
        });
        fetchSubscriptions(user.id);
      }
    } catch (error) {
      toast({
        title: "Gagal menjeda langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (
      !confirm(
        "Yakin mau batalkan langganan? Kamu akan kehilangan semua benefit yang ada 😢"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: "Langganan dibatalkan 😢",
          description:
            "Kami sedih kamu pergi. Semoga bisa kembali lagi suatu saat nanti!",
        });
        fetchSubscriptions(user.id);
      }
    } catch (error) {
      toast({
        title: "Gagal membatalkan langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/reactivate`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: "Selamat datang kembali! 🎉",
          description:
            "Langganan kamu sudah aktif lagi. Siap lanjut hidup sehat!",
        });
        fetchSubscriptions(user.id);
      }
    } catch (error) {
      toast({
        title: "Gagal mengaktifkan langganan 😔",
        description: "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard kamu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Halo, {user?.fullName}! 👋
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {subscriptions.filter((s) => s.status === "active").length}
              </div>
              <div className="text-gray-600">Langganan Aktif</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {subscriptions.filter((s) => s.status === "paused").length}
              </div>
              <div className="text-gray-600">Langganan Dijeda</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                Rp
                {subscriptions
                  .filter((s) => s.status === "active")
                  .reduce((total, s) => total + s.totalPrice, 0)
                  .toLocaleString()}
              </div>
              <div className="text-gray-600">Total Bulanan</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Subscriptions */}
        <Card className="shadow-2xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Langganan Aktif Kamu 🍽️</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {subscriptions.filter((s) => s.status === "active").length === 0 ? (
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
                {subscriptions
                  .filter((s) => s.status === "active")
                  .map((subscription) => (
                    <Card
                      key={subscription.id}
                      className="border-2 border-emerald-100">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {subscription.planName} - {subscription.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                📅 Mulai:{" "}
                                {new Date(
                                  subscription.createdAt
                                ).toLocaleDateString("id-ID")}
                              </span>
                              <span>
                                🍽️ {subscription.mealTypes.length} waktu makan
                              </span>
                              <span>
                                📦 {subscription.deliveryDays.length}{" "}
                                hari/minggu
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Rp{subscription.totalPrice.toLocaleString()}/bulan
                          </Badge>
                        </div>

                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Langganan</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Informasi Paket
                                    </h4>
                                    <p>Paket: {subscription.planName}</p>
                                    <p>
                                      Harga: Rp
                                      {subscription.totalPrice.toLocaleString()}
                                      /bulan
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Waktu Makan
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {subscription.mealTypes.map((meal) => (
                                        <Badge key={meal} variant="secondary">
                                          {meal}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Hari Pengiriman
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {subscription.deliveryDays.map((day) => (
                                      <Badge key={day} variant="outline">
                                        {day}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {subscription.allergies && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Alergi & Pantangan
                                    </h4>
                                    <p className="text-gray-600">
                                      {subscription.allergies}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-orange-600 border-orange-200">
                                <Pause className="h-4 w-4 mr-2" />
                                Jeda
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Jeda Langganan</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-gray-600">
                                  Pilih sampai kapan kamu mau jeda langganan.
                                  Selama dijeda, kamu tidak akan dikenakan
                                  biaya.
                                </p>
                                <DatePickerWithRange
                                  onSelect={(date) => {
                                    if (date?.to) {
                                      handlePauseSubscription(
                                        subscription.id,
                                        date.to
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200"
                            onClick={() =>
                              handleCancelSubscription(subscription.id)
                            }>
                            <X className="h-4 w-4 mr-2" />
                            Batalkan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paused Subscriptions */}
        {subscriptions.filter((s) => s.status === "paused").length > 0 && (
          <Card className="shadow-2xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Langganan Dijeda ⏸️</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6">
                {subscriptions
                  .filter((s) => s.status === "paused")
                  .map((subscription) => (
                    <Card
                      key={subscription.id}
                      className="border-2 border-orange-100">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {subscription.planName} - {subscription.name}
                            </h3>
                            <p className="text-orange-600">
                              Dijeda sampai:{" "}
                              {subscription.pauseUntil
                                ? new Date(
                                    subscription.pauseUntil
                                  ).toLocaleDateString("id-ID")
                                : "Tidak terbatas"}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800">
                            Dijeda
                          </Badge>
                        </div>

                        <Button
                          onClick={() =>
                            handleReactivateSubscription(subscription.id)
                          }
                          className="bg-gradient-to-r from-emerald-600 to-teal-600">
                          <Play className="h-4 w-4 mr-2" />
                          Aktifkan Lagi
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancelled Subscriptions */}
        {subscriptions.filter((s) => s.status === "cancelled").length > 0 && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Riwayat Langganan 📋</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6">
                {subscriptions
                  .filter((s) => s.status === "cancelled")
                  .map((subscription) => (
                    <Card
                      key={subscription.id}
                      className="border-2 border-gray-100">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {subscription.planName} - {subscription.name}
                            </h3>
                            <p className="text-gray-600">
                              Dibatalkan:{" "}
                              {subscription.cancelledAt
                                ? new Date(
                                    subscription.cancelledAt
                                  ).toLocaleDateString("id-ID")
                                : "N/A"}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-800">
                            Dibatalkan
                          </Badge>
                        </div>

                        <Button
                          onClick={() =>
                            handleReactivateSubscription(subscription.id)
                          }
                          variant="outline"
                          className="border-emerald-200 text-emerald-600">
                          <Play className="h-4 w-4 mr-2" />
                          Langganan Lagi
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
