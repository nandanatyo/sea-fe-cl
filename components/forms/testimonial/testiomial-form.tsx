"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  testimonialSchema,
  type TestimonialFormData,
} from "@/lib/validations/testimonial";
import { MEAL_PLANS, CITIES } from "@/lib/constants";

interface TestimonialFormProps {
  onSuccess?: () => void;
}

export function TestimonialForm({ onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
  });

  const watchedMessage = watch("reviewMessage", "");

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          rating: selectedRating,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Testimoni berhasil dikirim! 🎉",
          description:
            "Terima kasih sudah berbagi pengalaman. Testimoni akan ditampilkan setelah disetujui admin.",
        });
        reset();
        setSelectedRating(0);
        onSuccess?.();
      } else {
        throw new Error(result.error || "Gagal mengirim testimoni");
      }
    } catch (error) {
      toast({
        title: "Gagal mengirim testimoni 😔",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Bagikan Pengalaman Kamu
        </CardTitle>
        <p className="text-amber-100">
          Ceritakan pengalaman kamu dengan SEA Catering untuk membantu orang
          lain!
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName" className="text-base font-semibold">
                Nama Lengkap *
              </Label>
              <Input
                {...register("customerName")}
                placeholder="Nama yang akan ditampilkan"
                className="mt-2 h-12"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-semibold">
                Email *
              </Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="email@example.com"
                className="mt-2 h-12"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Plan and Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="plan" className="text-base font-semibold">
                Paket yang Digunakan *
              </Label>
              <Select onValueChange={(value) => setValue("plan", value)}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Pilih paket kamu" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_PLANS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.emoji} {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.plan.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location" className="text-base font-semibold">
                Lokasi *
              </Label>
              <Select onValueChange={(value) => setValue("location", value)}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Pilih kota kamu" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label className="text-base font-semibold">
              Rating Pengalaman *
            </Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-3xl transition-colors hover:scale-110 transform">
                  <Star
                    className={`h-8 w-8 ${
                      star <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600">
                {selectedRating > 0 && (
                  <span className="font-semibold">
                    {selectedRating}/5 -{" "}
                    {selectedRating === 5
                      ? "Luar biasa! 🌟"
                      : selectedRating === 4
                      ? "Sangat baik! 😊"
                      : selectedRating === 3
                      ? "Cukup baik 👍"
                      : selectedRating === 2
                      ? "Kurang memuaskan 😐"
                      : "Tidak memuaskan 😞"}
                  </span>
                )}
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Review Message */}
          <div>
            <Label htmlFor="reviewMessage" className="text-base font-semibold">
              Ceritakan Pengalaman Kamu *
            </Label>
            <Textarea
              {...register("reviewMessage")}
              placeholder="Bagaimana pengalaman kamu dengan SEA Catering? Ceritakan secara detail agar bisa membantu orang lain..."
              rows={6}
              className="mt-2 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                Minimal 50 karakter, maksimal 500 karakter
              </div>
              <div className="text-sm text-gray-500">
                {watchedMessage.length}/500
              </div>
            </div>
            {errors.reviewMessage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reviewMessage.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              📝 Ketentuan Testimoni:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Testimoni akan ditinjau oleh tim kami sebelum ditampilkan
              </li>
              <li>
                • Hanya testimoni yang membangun dan autentik yang akan
                disetujui
              </li>
              <li>
                • Testimoni yang mengandung SARA atau tidak sopan akan ditolak
              </li>
              <li>
                • Kami berhak mengedit testimoni untuk clarity tanpa mengubah
                makna
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading || selectedRating === 0}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 h-14 text-lg font-semibold shadow-lg hover:shadow-xl">
            {loading ? (
              "Mengirim testimoni..."
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                🎉 Kirim Testimoni Sekarang
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
