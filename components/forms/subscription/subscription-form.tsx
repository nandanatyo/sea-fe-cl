"use client";

import { useState, useMemo } from "react";
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
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations/subscription";
import { CITIES, MEAL_PLANS } from "@/lib/constants";
import { calculateSubscriptionPrice } from "@/lib/utils/calculations";
import { PlanSelector } from "./plan-selector";
import { MealTypeSelector } from "./meal-type-selector";
import { DeliveryDaySelector } from "./delivery-day-selector";
import { PriceSummary } from "./price-summary";

export function SubscriptionForm() {
  const { createSubscription, loading } = useSubscription();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: "",
    phone: "",
    plan: "",
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
    address: "",
    city: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: formData,
  });

  // Calculate total price
  const totalPrice = useMemo(() => {
    return calculateSubscriptionPrice(
      formData.plan,
      formData.mealTypes.length,
      formData.deliveryDays.length
    );
  }, [formData.plan, formData.mealTypes.length, formData.deliveryDays.length]);

  const handleMealTypeChange = (mealTypeId: string, checked: boolean) => {
    const newMealTypes = checked
      ? [...formData.mealTypes, mealTypeId]
      : formData.mealTypes.filter((id) => id !== mealTypeId);

    setFormData((prev) => ({ ...prev, mealTypes: newMealTypes }));
    setValue("mealTypes", newMealTypes);
  };

  const handleDeliveryDayChange = (dayId: string, checked: boolean) => {
    const newDeliveryDays = checked
      ? [...formData.deliveryDays, dayId]
      : formData.deliveryDays.filter((id) => id !== dayId);

    setFormData((prev) => ({ ...prev, deliveryDays: newDeliveryDays }));
    setValue("deliveryDays", newDeliveryDays);
  };

  const handlePlanChange = (planId: string) => {
    setFormData((prev) => ({ ...prev, plan: planId }));
    setValue("plan", planId);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    const success = await createSubscription({
      ...data,
      totalPrice: Math.round(totalPrice),
    });

    if (success) {
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
    }
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
              {/* Personal Information Section */}
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
                      {...register("name")}
                      placeholder="Masukkan nama lengkap kamu"
                      className="mt-2 h-12"
                      onChange={(e) => {
                        register("name").onChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
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
                      {...register("phone")}
                      placeholder="08123456789"
                      className="mt-2 h-12"
                      onChange={(e) => {
                        register("phone").onChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }));
                      }}
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
                      onValueChange={(value) => {
                        setValue("city", value);
                        setFormData((prev) => ({ ...prev, city: value }));
                      }}>
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
                      {...register("address")}
                      placeholder="Jl. Contoh No. 123, RT/RW"
                      className="mt-2 h-12"
                      onChange={(e) => {
                        register("address").onChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }));
                      }}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <PlanSelector
                selectedPlan={formData.plan}
                onPlanChange={handlePlanChange}
              />

              <MealTypeSelector
                selectedMealTypes={formData.mealTypes}
                onMealTypeChange={handleMealTypeChange}
              />

              <DeliveryDaySelector
                selectedDays={formData.deliveryDays}
                onDayChange={handleDeliveryDayChange}
              />

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
                  {...register("allergies")}
                  placeholder="Contoh: Alergi seafood, tidak suka pedas, vegetarian, dll. Kosongkan jika tidak ada."
                  rows={4}
                  className="resize-none"
                  onChange={(e) => {
                    register("allergies").onChange(e);
                    setFormData((prev) => ({
                      ...prev,
                      allergies: e.target.value,
                    }));
                  }}
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
        selectedPlan={formData.plan}
        mealTypesCount={formData.mealTypes.length}
        deliveryDaysCount={formData.deliveryDays.length}
        totalPrice={totalPrice}
      />
    </div>
  );
}
