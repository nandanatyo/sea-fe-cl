"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [metrics, setMetrics] = useState({
    newSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    reactivations: 0,
    subscriptionGrowth: 0,
    totalActiveSubscriptions: 0,
    totalUsers: 0,
    conversionRate: 0,
    churnRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      toast({
        title: "Akses Ditolak 🚫",
        description: "Kamu tidak memiliki akses ke halaman admin.",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(
        `/api/admin/metrics?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      );
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        title: "Gagal memuat data 😔",
        description: "Coba refresh halaman ya!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard 👑
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Selamat datang, {user?.fullName}! Monitor performa SEA Catering di
              sini.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/users")}>
              <Users className="h-4 w-4 mr-2" />
              Kelola User
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filter Periode Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <DatePickerWithRange
                date={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
              />
              <div className="text-sm text-gray-600">
                Menampilkan data dari{" "}
                <strong>{formatDate(dateRange.from)}</strong> sampai{" "}
                <strong>{formatDate(dateRange.to)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Langganan Baru
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.newSubscriptions}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    dalam periode ini
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Monthly Recurring Revenue
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(metrics.monthlyRecurringRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    pendapatan bulanan
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Reaktivasi
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {metrics.reactivations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    langganan kembali aktif
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Langganan Aktif
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {metrics.totalActiveSubscriptions}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">saat ini</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Pertumbuhan Langganan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Pertumbuhan periode ini:
                  </span>
                  <Badge
                    variant={
                      metrics.subscriptionGrowth >= 0
                        ? "default"
                        : "destructive"
                    }
                    className="text-lg px-3 py-1">
                    {metrics.subscriptionGrowth >= 0 ? "+" : ""}
                    {metrics.subscriptionGrowth}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Total pengguna terdaftar:
                  </span>
                  <span className="font-bold text-xl">
                    {metrics.totalUsers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversion rate:</span>
                  <span className="font-bold text-xl text-green-600">
                    {metrics.conversionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Churn rate:</span>
                  <span className="font-bold text-xl text-red-600">
                    {metrics.churnRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Ringkasan Bisnis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    📈 Performa Bulan Ini
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• {metrics.newSubscriptions} pelanggan baru bergabung</p>
                    <p>
                      • Revenue meningkat{" "}
                      {formatCurrency(metrics.monthlyRecurringRevenue)}
                    </p>
                    <p>• {metrics.reactivations} pelanggan kembali aktif</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    🎯 Target & Pencapaian
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Target bulanan: 100 langganan baru</p>
                    <p>
                      • Pencapaian: {metrics.newSubscriptions}/100 (
                      {Math.round((metrics.newSubscriptions / 100) * 100)}
                      %)
                    </p>
                    <p>
                      • Status:{" "}
                      {metrics.newSubscriptions >= 100
                        ? "✅ Target tercapai!"
                        : "🔥 Terus semangat!"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    💡 Insight
                  </h4>
                  <div className="text-sm text-purple-700">
                    {metrics.subscriptionGrowth > 10
                      ? "Pertumbuhan sangat baik! Pertahankan strategi marketing saat ini."
                      : metrics.subscriptionGrowth > 0
                      ? "Pertumbuhan stabil. Coba tingkatkan engagement dengan pelanggan."
                      : "Perlu evaluasi strategi. Fokus pada retention dan customer satisfaction."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru 📊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Langganan baru dari Jakarta</p>
                  <p className="text-sm text-gray-600">
                    Ibu Sarah memilih Royal Plan - 2 jam yang lalu
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800">
                  Baru
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Pembayaran berhasil</p>
                  <p className="text-sm text-gray-600">
                    Pak Budi - Protein Plan Rp1.720.000 - 3 jam yang lalu
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800">
                  Pembayaran
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Reaktivasi langganan</p>
                  <p className="text-sm text-gray-600">
                    Mbak Fitri mengaktifkan kembali Diet Plan - 5 jam yang lalu
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800">
                  Reaktivasi
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Testimoni baru</p>
                  <p className="text-sm text-gray-600">
                    Rating 5 bintang dari Pak Ahmad - 1 hari yang lalu
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800">
                  Testimoni
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
