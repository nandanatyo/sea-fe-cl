// components/forms/subscription/subscription-form.tsx - Fixed version
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
import { Heart, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useAuth } from "@/lib/hooks/use-auth";
import { useApiError } from "@/hooks/use-api-error";
import { mealPlansService, type MealPlan } from "@/lib/api/meal-plans";
import { notifications } from "@/lib/utils/notifications";
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations/subscription";
import { CITIES, MEAL_PLANS, MEAL_TYPES, DELIVERY_DAYS } from "@/lib/constants";
import { Plan } from "@/lib/types";
import {
  calculateSubscriptionPrice as utilCalculatePrice,
  findPlanById,
  validatePricingFormData,
} from "@/lib/utils/calculations";
import { PlanSelector } from "./plan-selector";
import { MealTypeSelector } from "./meal-type-selector";
import { DeliveryDaySelector } from "./delivery-day-selector";
import { PriceSummary } from "./price-summary";
import { ErrorFallback } from "@/components/common/error-fallback";

export function SubscriptionForm() {
  const { user } = useAuth();
  const { createSubscription, loading } = useSubscription(user?.id);
  const { handleError, handleSuccess } = useApiError();
  const [availablePlans, setAvailablePlans] = useState<Plan[]>(MEAL_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [planError, setPlanError] = useState<Error | null>(null);

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

  // Enhanced calculation function that works with both backend and frontend data
  const calculateSubscriptionPrice = (
    planId: string,
    mealTypesCount: number,
    deliveryDaysCount: number
  ): number => {
    if (!planId || mealTypesCount === 0 || deliveryDaysCount === 0) {
      return 0;
    }

    const plan = findPlanById(planId, availablePlans);
    if (!plan) {
      console.log("❌ Plan not found for calculation:", planId);
      return 0;
    }

    const totalPrice = plan.price * mealTypesCount * deliveryDaysCount * 4.3;
    console.log("💰 Price calculation:", {
      planId,
      planPrice: plan.price,
      mealTypesCount,
      deliveryDaysCount,
      totalPrice: Math.round(totalPrice),
    });

    return Math.round(totalPrice);
  };

  // Fetch available meal plans from backend with enhanced error handling
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoadingPlans(true);
        setPlanError(null);

        console.log("📋 Fetching meal plans from backend...");
        const response = await mealPlansService.getActive();

        console.log("📋 Backend response:", response);

        if (response.success && response.data && response.data.length > 0) {
          // Convert backend meal plans to frontend format with enhanced mapping
          const convertedPlans = response.data.map((backendPlan: MealPlan) => {
            const frontendPlan: Plan = {
              id: backendPlan.id,
              name: backendPlan.name,
              subtitle: getSubtitleForPlan(backendPlan.name),
              price: backendPlan.price,
              originalPrice: Math.round(backendPlan.price * 1.2),
              description: backendPlan.description,
              image: backendPlan.image_url,
              emoji: getEmojiForPlan(backendPlan.name),
              features: Array.isArray(backendPlan.features)
                ? backendPlan.features
                : typeof backendPlan.features === "string"
                ? JSON.parse(backendPlan.features)
                : getDefaultFeaturesForPlan(backendPlan.name),
              sampleMenus: getSampleMenusForPlan(backendPlan.name),
              calories: getCaloriesForPlan(backendPlan.name),
              servings: "1 porsi",
              prepTime: "Siap santap",
              popular: checkIfPopular(backendPlan.name),
              badge: getBadgeForPlan(backendPlan.name),
            };

            console.log("📋 Converted plan:", {
              id: frontendPlan.id,
              name: frontendPlan.name,
              price: frontendPlan.price,
            });

            return frontendPlan;
          });

          setAvailablePlans(convertedPlans);
          console.log(
            "📋 Successfully loaded backend plans:",
            convertedPlans.length
          );

          notifications.success({
            title: "Menu berhasil dimuat! 🍽️",
            description: `${convertedPlans.length} paket tersedia untuk kamu`,
            duration: 3000,
          });
        } else {
          // Use fallback static data
          console.log("📋 No backend data, using fallback plans");
          setAvailablePlans(MEAL_PLANS);
          notifications.warning({
            title: "Menggunakan menu default",
            description: "Koneksi ke server terbatas, menampilkan menu standar",
          });
        }
      } catch (error) {
        console.error("📋 Failed to fetch meal plans:", error);
        setPlanError(error as Error);
        setAvailablePlans(MEAL_PLANS);
        handleError(error, "memuat paket makanan");
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchMealPlans();
  }, [handleError]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setValue("name", user.name || user.fullName || "");
    }
  }, [user, setValue]);

  // Enhanced total price calculation with better debugging
  const totalPrice = useMemo(() => {
    const price = utilCalculatePrice(
      watchedFields.plan,
      watchedFields.mealTypes?.length || 0,
      watchedFields.deliveryDays?.length || 0,
      availablePlans // Pass available plans for accurate calculation
    );

    console.log("💰 Total price recalculated:", {
      plan: watchedFields.plan,
      mealTypesCount: watchedFields.mealTypes?.length || 0,
      deliveryDaysCount: watchedFields.deliveryDays?.length || 0,
      totalPrice: price,
      availablePlansCount: availablePlans.length,
    });

    return price;
  }, [
    watchedFields.plan,
    watchedFields.mealTypes?.length,
    watchedFields.deliveryDays?.length,
    availablePlans, // Add this dependency to recalculate when plans change
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
    console.log("📋 Plan changed to:", planId);
    setValue("plan", planId, { shouldValidate: true });
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    if (!user) {
      notifications.warning({
        title: "Login diperlukan 🔐",
        description: "Silakan login terlebih dahulu untuk membuat langganan",
        action: {
          label: "Login Sekarang",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    // Validate pricing data before submission
    const validation = validatePricingFormData({
      planId: data.plan,
      mealTypesCount: data.mealTypes?.length || 0,
      deliveryDaysCount: data.deliveryDays?.length || 0,
      availablePlans,
    });

    if (!validation.isValid) {
      notifications.validationError(validation.errors.join(", "));
      return;
    }

    console.log("📝 Form submission:", {
      ...data,
      totalPrice: Math.round(totalPrice),
      selectedPlan: validation.plan,
    });

    try {
      const success = await createSubscription({
        ...data,
        totalPrice: Math.round(totalPrice),
      });

      if (success) {
        reset();
        handleSuccess(
          "Langganan berhasil dibuat! 🎉",
          "Tim kami akan segera menghubungi kamu"
        );
      }
    } catch (error) {
      handleError(error, "membuat langganan");
    }
  };

  const handleRetryPlans = async () => {
    window.location.reload();
  };

  // Enhanced helper functions with better defaults
  const getSubtitleForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "Si Langsing Sehat";
    if (lowerName.includes("protein")) return "Si Jagoan Otot";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "Si Mewah Bergizi";
    return "Plan Premium";
  };

  const getEmojiForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "💚";
    if (lowerName.includes("protein")) return "💪";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "👑";
    return "🍽️";
  };

  const getDefaultFeaturesForPlan = (name: string): string[] => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) {
      return [
        "🌾 Nasi merah organik dari Cianjur",
        "🥬 Sayuran hidroponik segar",
        "🍗 Protein tanpa lemak berlebih",
        "👩‍⚕️ Disetujui ahli gizi Indonesia",
      ];
    }
    if (lowerName.includes("protein")) {
      return [
        "🥩 Daging sapi pilihan grade A",
        "🐟 Ikan salmon & tuna segar",
        "🥚 Telur omega-3 premium",
        "💪 Formula khusus muscle building",
      ];
    }
    if (lowerName.includes("royal") || lowerName.includes("premium")) {
      return [
        "👑 Bahan premium imported",
        "👨‍🍳 Dimasak chef berpengalaman",
        "🍽️ Presentasi restaurant-quality",
        "✨ Limited edition recipes",
      ];
    }
    return [
      "🍽️ Menu bergizi seimbang",
      "✨ Bahan segar berkualitas",
      "👨‍🍳 Dimasak dengan cinta",
      "📦 Dikemas higienis",
    ];
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
    if (lowerName.includes("royal") || lowerName.includes("premium")) {
      return [
        "Wagyu Steak + Truffle Rice + Asparagus Grilled",
        "Lobster Thermidor + Garlic Bread + Caesar Salad",
        "Duck Confit + Mashed Potato + Ratatouille",
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

  // Show error fallback if plan loading failed
  if (planError) {
    return (
      <ErrorFallback
        error={planError}
        title="Gagal memuat paket makanan"
        description="Terjadi kesalahan saat memuat daftar paket makanan"
        resetError={handleRetryPlans}
        showDetails={process.env.NODE_ENV === "development"}
      />
    );
  }

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
                      disabled={loading}
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
                      disabled={loading}
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
                      value={watchedFields.city}
                      disabled={loading}>
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
                      disabled={loading}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Selection with loading state */}
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
                <>
                  <PlanSelector
                    selectedPlan={watchedFields.plan}
                    onPlanChange={handlePlanChange}
                    availablePlans={availablePlans}
                  />
                  {errors.plan && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.plan.message}
                    </p>
                  )}
                </>
              )}

              <MealTypeSelector
                selectedMealTypes={watchedFields.mealTypes || []}
                onMealTypeChange={handleMealTypeChange}
              />
              {errors.mealTypes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mealTypes.message}
                </p>
              )}

              <DeliveryDaySelector
                selectedDays={watchedFields.deliveryDays || []}
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
                  disabled={loading}
                />
              </div>

              {/* Warning for offline users */}
              {!navigator.onLine && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Tidak ada koneksi internet
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        Data akan disimpan ketika koneksi kembali normal
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  loading ||
                  totalPrice === 0 ||
                  !navigator.onLine ||
                  !watchedFields.plan
                }
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? "Memproses..."
                  : !navigator.onLine
                  ? "Menunggu Koneksi..."
                  : totalPrice === 0
                  ? "Lengkapi Data untuk Melanjutkan"
                  : "🎉 Buat Langganan Sekarang"}
              </Button>

              {/* Debug info for development */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-gray-100 p-3 rounded text-xs">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>Loading: {loading ? "Yes" : "No"}</p>
                  <p>Plan Selected: {watchedFields.plan || "None"}</p>
                  <p>Meal Types: {watchedFields.mealTypes?.length || 0}</p>
                  <p>
                    Delivery Days: {watchedFields.deliveryDays?.length || 0}
                  </p>
                  <p>Total Price: Rp{totalPrice.toLocaleString()}</p>
                  <p>Available Plans: {availablePlans.length}</p>
                  <p>
                    Button Disabled:{" "}
                    {loading ||
                    totalPrice === 0 ||
                    !navigator.onLine ||
                    !watchedFields.plan
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Price Summary that works with both data sources */}
      <PriceSummary
        selectedPlan={watchedFields.plan}
        mealTypesCount={watchedFields.mealTypes?.length || 0}
        deliveryDaysCount={watchedFields.deliveryDays?.length || 0}
        totalPrice={totalPrice}
        availablePlans={availablePlans}
      />
    </div>
  );
}
