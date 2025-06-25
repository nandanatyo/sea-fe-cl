"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Heart, Shield, Truck } from "lucide-react";

const plans = [
  {
    id: "diet",
    name: "Diet Plan - Si Langsing Sehat",
    price: 30000,
    emoji: "💚",
  },
  {
    id: "protein",
    name: "Protein Plan - Si Jagoan Otot",
    price: 40000,
    emoji: "💪",
  },
  {
    id: "royal",
    name: "Royal Plan - Si Mewah Bergizi",
    price: 60000,
    emoji: "👑",
  },
];

const mealTypes = [
  { id: "breakfast", name: "Sarapan", emoji: "🌅", time: "06:00-09:00" },
  { id: "lunch", name: "Makan Siang", emoji: "☀️", time: "11:00-14:00" },
  { id: "dinner", name: "Makan Malam", emoji: "🌙", time: "17:00-20:00" },
];

const deliveryDays = [
  { id: "monday", name: "Senin", emoji: "📅" },
  { id: "tuesday", name: "Selasa", emoji: "📅" },
  { id: "wednesday", name: "Rabu", emoji: "📅" },
  { id: "thursday", name: "Kamis", emoji: "📅" },
  { id: "friday", name: "Jumat", emoji: "📅" },
  { id: "saturday", name: "Sabtu", emoji: "📅" },
  { id: "sunday", name: "Minggu", emoji: "📅" },
];

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plan: "",
    mealTypes: [] as string[],
    deliveryDays: [] as string[],
    allergies: "",
    address: "",
    city: "",
  });

  const handleMealTypeChange = (mealTypeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      mealTypes: checked
        ? [...prev.mealTypes, mealTypeId]
        : prev.mealTypes.filter((id) => id !== mealTypeId),
    }));
  };

  const handleDeliveryDayChange = (dayId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      deliveryDays: checked
        ? [...prev.deliveryDays, dayId]
        : prev.deliveryDays.filter((id) => id !== dayId),
    }));
  };

  const calculateTotalPrice = () => {
    if (
      !formData.plan ||
      formData.mealTypes.length === 0 ||
      formData.deliveryDays.length === 0
    ) {
      return 0;
    }

    const selectedPlan = plans.find((p) => p.id === formData.plan);
    if (!selectedPlan) return 0;

    return (
      selectedPlan.price *
      formData.mealTypes.length *
      formData.deliveryDays.length *
      4.3
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.plan ||
      formData.mealTypes.length === 0 ||
      formData.deliveryDays.length === 0 ||
      !formData.address ||
      !formData.city
    ) {
      toast({
        title: "Oops! Ada yang terlewat 😅",
        description: "Mohon lengkapi semua field yang wajib diisi ya!",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    if (!/^08[0-9]{8,11}$/.test(formData.phone)) {
      toast({
        title: "Format nomor HP salah 📱",
        description:
          "Gunakan format Indonesia yang benar (contoh: 08123456789)",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalPrice: calculateTotalPrice(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Yeay! Langganan berhasil dibuat! 🎉",
          description:
            "Tim kami akan segera menghubungi kamu untuk konfirmasi. Selamat memulai hidup sehat!",
        });
        // Reset form
        setFormData({
          name: "",
          phone: "",
          plan: "",
          mealTypes: [],
          deliveryDays: [],
          allergies: "",
          address: "",
          city: "",
        });
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      toast({
        title: "Waduh, ada kendala teknis 😔",
        description:
          "Coba lagi dalam beberapa saat ya. Atau hubungi customer service kami!",
        variant: "destructive",
      });
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-800">
            🚀 Mulai Hidup Sehat
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Yuk, Langganan Sekarang!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tinggal isi form di bawah, dan kamu sudah selangkah lebih dekat
            dengan hidup sehat yang enak! Tim ahli gizi kami akan pastikan menu
            yang kamu terima sesuai dengan kebutuhan tubuh kamu 💪
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Detail Langganan Kamu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">1</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Data Pribadi
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-base font-semibold">
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Masukkan nama lengkap kamu"
                          className="mt-2 h-12"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-base font-semibold">
                          Nomor WhatsApp Aktif *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="08123456789"
                          className="mt-2 h-12"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Format: 08xxxxxxxxx
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="city"
                          className="text-base font-semibold">
                          Kota *
                        </Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, city: value }))
                          }>
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue placeholder="Pilih kota kamu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jakarta">🏙️ Jakarta</SelectItem>
                            <SelectItem value="surabaya">
                              🌆 Surabaya
                            </SelectItem>
                            <SelectItem value="bandung">🏔️ Bandung</SelectItem>
                            <SelectItem value="medan">🌴 Medan</SelectItem>
                            <SelectItem value="yogyakarta">
                              🏛️ Yogyakarta
                            </SelectItem>
                            <SelectItem value="semarang">
                              🌊 Semarang
                            </SelectItem>
                            <SelectItem value="makassar">
                              🏖️ Makassar
                            </SelectItem>
                            <SelectItem value="palembang">
                              🌉 Palembang
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-base font-semibold">
                          Alamat Lengkap *
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          placeholder="Jl. Contoh No. 123, RT/RW"
                          className="mt-2 h-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pilih Paket Makanan *
                      </h3>
                    </div>

                    <div className="grid gap-4">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.plan === plan.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, plan: plan.id }))
                          }>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{plan.emoji}</span>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {plan.name}
                                </div>
                                <div className="text-emerald-600 font-bold">
                                  Rp{plan.price.toLocaleString()}/hari
                                </div>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 ${
                                formData.plan === plan.id
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "border-gray-300"
                              }`}>
                              {formData.plan === plan.id && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meal Types */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Waktu Makan *
                      </h3>
                    </div>
                    <p className="text-gray-600">Pilih minimal 1 waktu makan</p>

                    <div className="grid md:grid-cols-3 gap-4">
                      {mealTypes.map((mealType) => (
                        <div
                          key={mealType.id}
                          className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50">
                          <Checkbox
                            id={mealType.id}
                            checked={formData.mealTypes.includes(mealType.id)}
                            onCheckedChange={(checked) =>
                              handleMealTypeChange(mealType.id, !!checked)
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={mealType.id}
                              className="flex items-center gap-2 cursor-pointer">
                              <span className="text-xl">{mealType.emoji}</span>
                              <div>
                                <div className="font-semibold">
                                  {mealType.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {mealType.time}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Days */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">4</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Hari Pengiriman *
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      Pilih hari-hari kamu mau terima makanan sehat
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {deliveryDays.map((day) => (
                        <div
                          key={day.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={day.id}
                            checked={formData.deliveryDays.includes(day.id)}
                            onCheckedChange={(checked) =>
                              handleDeliveryDayChange(day.id, !!checked)
                            }
                          />
                          <Label
                            htmlFor={day.id}
                            className="flex items-center gap-2 cursor-pointer">
                            <span>{day.emoji}</span>
                            <span className="font-medium">{day.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-bold">5</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Alergi & Pantangan
                      </h3>
                    </div>
                    <Textarea
                      value={formData.allergies}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allergies: e.target.value,
                        }))
                      }
                      placeholder="Contoh: Alergi seafood, tidak suka pedas, vegetarian, dll. Kosongkan jika tidak ada."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl">
                    🎉 Buat Langganan Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24 shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {formData.plan && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Paket:</span>
                      <span className="font-semibold">
                        {
                          plans
                            .find((p) => p.id === formData.plan)
                            ?.name.split(" - ")[0]
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Harga per hari:</span>
                      <span className="font-semibold text-emerald-600">
                        Rp
                        {plans
                          .find((p) => p.id === formData.plan)
                          ?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {formData.mealTypes.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waktu makan:</span>
                    <span className="font-semibold">
                      {formData.mealTypes.length} waktu
                    </span>
                  </div>
                )}

                {formData.deliveryDays.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hari pengiriman:</span>
                    <span className="font-semibold">
                      {formData.deliveryDays.length} hari/minggu
                    </span>
                  </div>
                )}

                {totalPrice > 0 && (
                  <>
                    <div className="border-t pt-4 space-y-3">
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="font-semibold mb-1">Cara Hitung:</div>
                        <div>
                          Rp
                          {plans
                            .find((p) => p.id === formData.plan)
                            ?.price.toLocaleString()}{" "}
                          × {formData.mealTypes.length} ×{" "}
                          {formData.deliveryDays.length} × 4.3
                        </div>
                        <div className="text-xs mt-1 text-gray-500">
                          *4.3 = rata-rata minggu per bulan
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl text-center">
                        <div className="text-sm opacity-90 mb-1">
                          Total per Bulan:
                        </div>
                        <div className="text-2xl font-bold">
                          Rp{Math.round(totalPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Garansi uang kembali 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Gratis ongkir se-Indonesia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Konsultasi gratis dengan ahli gizi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Mini */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="text-sm italic text-gray-600 mb-3">
                    "Udah 6 bulan langganan, berat badan turun 12kg! Yang paling
                    suka, rasanya enak banget kayak masakan rumah."
                  </p>
                  <div className="text-sm font-semibold text-emerald-600">
                    - Ibu Sari, Jakarta
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
