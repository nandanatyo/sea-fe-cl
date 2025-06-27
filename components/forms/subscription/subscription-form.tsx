// components/forms/subscription/subscription-form.tsx
"use client";

import { useMemo, useEffect, useState } from "react";
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
import { Heart } from "lucide-react";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useAuth } from "@/lib/hooks/use-auth";
import { mealPlansService, type MealPlan } from "@/lib/api/meal-plans";
import { useToast } from "@/hooks/use-toast";
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations/subscription";
import { CITIES, MEAL_PLANS, MEAL_TYPES, DELIVERY_DAYS } from "@/lib/constants";
import { calculateSubscriptionPrice } from "@/lib/utils/calculations";
import { PlanSelector } from "./plan-selector";
import { MealTypeSelector } from "./meal-type-selector";
import { DeliveryDaySelector } from "./delivery-day-selector";
import { PriceSummary } from "./price-summary";

export function SubscriptionForm() {
  const { user } = useAuth();
  const { createSubscription, loading } = useSubscription(user?.id);
  const { toast } = useToast();
  const [availablePlans, setAvailablePlans] = useState(MEAL_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: user?.name || user?.fullName || "",
      phone: "",
      plan: "",
      mealTypes: [],
      deliveryDays: [],
      allergies: "",
      address: "",
      city: "",
    },
  });

  const watchedFields = watch();

  // Fetch available meal plans from backend
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await mealPlansService.getActive();

        if (response.success && response.data && response.data.length > 0) {
          // Convert backend meal plans to frontend format
          const convertedPlans = response.data.map((backendPlan: MealPlan) => ({
            id: backendPlan.id,
            name: backendPlan.name,
            subtitle: `Plan Premium`,
            price: backendPlan.price,
            originalPrice: Math.round(backendPlan.price * 1.2),
            description: backendPlan.description,
            image: backendPlan.image_url,
            emoji: getEmojiForPlan(backendPlan.name),
            features: backendPlan.features || [],
            sampleMenus: getSampleMenusForPlan(backendPlan.name),
            calories: getCaloriesForPlan(backendPlan.name),
            servings: "1 porsi",
            prepTime: "Siap santap",
            popular: checkIfPopular(backendPlan.name),
            badge: getBadgeForPlan(backendPlan.name),
          }));

          setAvailablePlans(convertedPlans);
        }
      } catch (error) {
        console.error("Failed to fetch meal plans:", error);
        // Use fallback static data
        setAvailablePlans(MEAL_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchMealPlans();
  }, []);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setValue("name", user.name || user.fullName || "");
    }
  }, [user, setValue]);

  const totalPrice = useMemo(() => {
    return calculateSubscriptionPrice(
      watchedFields.plan,
      watchedFields.mealTypes.length,
      watchedFields.deliveryDays.length
    );
  }, [
    watchedFields.plan,
    watchedFields.mealTypes.length,
    watchedFields.deliveryDays.length,
  ]);

  const handleMealTypeChange = (mealTypeId: string, checked: boolean) => {
    const currentMealTypes = watchedFields.mealTypes || [];
    const newMealTypes = checked
      ? [...currentMealTypes, mealTypeId]
      : currentMealTypes.filter((id) => id !== mealTypeId);
    setValue("mealTypes", newMealTypes, { shouldValidate: true });
  };

  const handleDeliveryDayChange = (dayId: string, checked: boolean) => {
    const currentDeliveryDays = watchedFields.deliveryDays || [];
    const newDeliveryDays = checked
      ? [...currentDeliveryDays, dayId]
      : currentDeliveryDays.filter((id) => id !== dayId);
    setValue("deliveryDays", newDeliveryDays, { shouldValidate: true });
  };

  const handlePlanChange = (planId: string) => {
    setValue("plan", planId, { shouldValidate: true });
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!user) {
      toast({
        title: "Login diperlukan 🔐",
        description: "Silakan login terlebih dahulu untuk membuat langganan",
        variant: "destructive",
      });
      return;
    }

    const success = await createSubscription({
      ...data,
      totalPrice: Math.round(totalPrice),
    });

    if (success) {
      reset();
    }
  };

  // Helper functions for plan conversion
  const getEmojiForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "💚";
    if (lowerName.includes("protein")) return "💪";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "👑";
    return "🍽️";
  };

  const getSampleMenusForPlan = (name: string): string[] => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) {
      return [
        "Ayam Bakar Bumbu Bali + Nasi Merah + Gado-gado Mini",
        "Ikan Kakap Asam Manis + Tumis Kangkung + Buah Naga",
        "Tahu Tempe Bacem + Sayur Asem + Pisang Rebus",
      ];
    }
    if (lowerName.includes("protein")) {
      return [
        "Rendang Protein + Quinoa + Salad Alpukat",
        "Salmon Teriyaki + Nasi Shirataki + Edamame",
        "Ayam Geprek Sehat + Sweet Potato + Smoothie Protein",
      ];
    }
    return [
      "Menu spesial chef",
      "Hidangan bergizi seimbang",
      "Makanan segar setiap hari",
    ];
  };

  const getCaloriesForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "350-450 kalori";
    if (lowerName.includes("protein")) return "500-650 kalori";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "600-750 kalori";
    return "400-500 kalori";
  };

  const checkIfPopular = (name: string): boolean => {
    return name.toLowerCase().includes("protein");
  };

  const getBadgeForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "💚 Favorit Ibu-ibu";
    if (lowerName.includes("protein")) return "🔥 Paling Laris";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "👑 Eksklusif";
    return "✨ Recommended";
  };

  return (
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    <Label htmlFor="name" className="text-base font-semibold">
                      Nama Lengkap *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Masukkan nama lengkap kamu"
                      className="mt-2 h-12"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Nomor WhatsApp Aktif *
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="08123456789"
                      className="mt-2 h-12"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-base font-semibold">
                      Kota *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("city", value, { shouldValidate: true })
                      }
                      value={watchedFields.city}>
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
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-base font-semibold">
                      Alamat Lengkap *
                    </Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Jl. Contoh No. 123, RT/RW"
                      className="mt-2 h-12"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              {loadingPlans ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-300 rounded mb-2"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <PlanSelector
                  selectedPlan={watchedFields.plan}
                  onPlanChange={handlePlanChange}
                  availablePlans={availablePlans}
                />
              )}
              {errors.plan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.plan.message}
                </p>
              )}

              <MealTypeSelector
                selectedMealTypes={watchedFields.mealTypes}
                onMealTypeChange={handleMealTypeChange}
              />
              {errors.mealTypes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mealTypes.message}
                </p>
              )}

              <DeliveryDaySelector
                selectedDays={watchedFields.deliveryDays}
                onDayChange={handleDeliveryDayChange}
              />
              {errors.deliveryDays && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliveryDays.message}
                </p>
              )}

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
                  id="allergies"
                  {...register("allergies")}
                  placeholder="Contoh: Alergi seafood, tidak suka pedas, vegetarian, dll. Kosongkan jika tidak ada."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || totalPrice === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Memproses..." : "🎉 Buat Langganan Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <PriceSummary
        selectedPlan={watchedFields.plan}
        mealTypesCount={watchedFields.mealTypes.length}
        deliveryDaysCount={watchedFields.deliveryDays.length}
        totalPrice={totalPrice}
        availablePlans={availablePlans}
      />
    </div>
  );
}
