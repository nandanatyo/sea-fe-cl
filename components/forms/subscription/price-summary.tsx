// components/forms/subscription/price-summary.tsx - Fixed version
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Shield, Truck, Heart } from "lucide-react";
import { Plan } from "@/lib/types";

interface PriceSummaryProps {
  selectedPlan: string;
  mealTypesCount: number;
  deliveryDaysCount: number;
  totalPrice: number;
  availablePlans?: Plan[];
}

export function PriceSummary({
  selectedPlan,
  mealTypesCount,
  deliveryDaysCount,
  totalPrice,
  availablePlans = [],
}: PriceSummaryProps) {
  // Find the selected plan from available plans
  const plan = availablePlans.find((p) => p.id === selectedPlan);

  console.log("💰 PriceSummary render:", {
    selectedPlan,
    planFound: !!plan,
    planPrice: plan?.price,
    mealTypesCount,
    deliveryDaysCount,
    totalPrice,
    availablePlansCount: availablePlans.length,
  });

  return (
    <Card className="sticky top-24 shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Show plan information if available */}
        {plan ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paket:</span>
              <span className="font-semibold flex items-center gap-1">
                {plan.emoji} {plan.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Harga per hari:</span>
              <span className="font-semibold text-emerald-600">
                Rp{plan.price.toLocaleString()}
              </span>
            </div>
          </div>
        ) : selectedPlan ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paket:</span>
              <span className="font-semibold text-orange-600">
                {selectedPlan} (Loading...)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Pilih paket untuk melihat harga</p>
          </div>
        )}

        {/* Meal types count */}
        {mealTypesCount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Waktu makan:</span>
            <span className="font-semibold">{mealTypesCount} waktu</span>
          </div>
        )}

        {/* Delivery days count */}
        {deliveryDaysCount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Hari pengiriman:</span>
            <span className="font-semibold">
              {deliveryDaysCount} hari/minggu
            </span>
          </div>
        )}

        {/* Price calculation and total */}
        {totalPrice > 0 && plan ? (
          <>
            <div className="border-t pt-4 space-y-3">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold mb-1">Cara Hitung:</div>
                <div>
                  Rp{plan.price.toLocaleString()} × {mealTypesCount} ×{" "}
                  {deliveryDaysCount} × 4.3
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  *4.3 = rata-rata minggu per bulan
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl text-center">
                <div className="text-sm opacity-90 mb-1">Total per Bulan:</div>
                <div className="text-2xl font-bold">
                  Rp{totalPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="border-t pt-4">
            <div className="text-center text-gray-500 py-4">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {!selectedPlan
                  ? "Pilih paket untuk melihat total harga"
                  : mealTypesCount === 0
                  ? "Pilih waktu makan untuk melihat harga"
                  : deliveryDaysCount === 0
                  ? "Pilih hari pengiriman untuk melihat harga"
                  : "Menghitung harga..."}
              </p>
            </div>
          </div>
        )}

        {/* Benefits section */}
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
  );
}
