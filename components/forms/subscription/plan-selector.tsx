// components/forms/subscription/plan-selector.tsx - Fixed version
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plan } from "@/lib/types";

interface PlanSelectorProps {
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
  availablePlans?: Plan[];
}

export function PlanSelector({
  selectedPlan,
  onPlanChange,
  availablePlans = [],
}: PlanSelectorProps) {
  console.log("📋 PlanSelector render:", {
    selectedPlan,
    availablePlansCount: availablePlans.length,
    availablePlans: availablePlans.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    })),
  });

  const handlePlanClick = (planId: string) => {
    console.log("📋 Plan clicked:", planId);
    onPlanChange(planId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 font-bold">2</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Pilih Paket Makanan *
        </h3>
      </div>

      {availablePlans.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
          <p className="text-gray-500 mt-4">Sedang memuat paket makanan...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {availablePlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            console.log("📋 Rendering plan:", {
              id: plan.id,
              name: plan.name,
              price: plan.price,
              isSelected,
            });

            return (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                }`}
                onClick={() => handlePlanClick(plan.id)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Plan emoji and info */}
                      <div className="text-3xl">{plan.emoji || "🍽️"}</div>

                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 mb-1">
                          {plan.name}
                        </div>

                        <div className="text-emerald-600 font-bold text-lg mb-2">
                          Rp{plan.price.toLocaleString()}/hari
                        </div>

                        {plan.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {plan.description}
                          </div>
                        )}

                        {/* Show popular badge */}
                        {plan.popular && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              🔥 Paling Laris
                            </span>
                          </div>
                        )}

                        {/* Show badge if available */}
                        {plan.badge && !plan.popular && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {plan.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    <div className="ml-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 hover:border-emerald-400"
                        }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show features if selected */}
                  {isSelected && plan.features && plan.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-emerald-200">
                      <div className="text-sm font-medium text-emerald-800 mb-2">
                        Keunggulan:
                      </div>
                      <div className="grid gap-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div
                            key={index}
                            className="text-sm text-emerald-700 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <div className="text-xs text-emerald-600 mt-1">
                            +{plan.features.length - 3} keunggulan lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show price comparison if original price exists */}
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 line-through">
                          Rp{plan.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          HEMAT{" "}
                          {Math.round(
                            ((plan.originalPrice - plan.price) /
                              plan.originalPrice) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Help text */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>💡 Tips:</strong> Semua paket sudah termasuk:
        </div>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• 📦 Kemasan food grade yang aman</li>
          <li>• 🚚 Pengiriman gratis ke seluruh Indonesia</li>
          <li>• 👩‍⚕️ Konsultasi gratis dengan ahli gizi</li>
          <li>• 🔄 Garansi uang kembali 100%</li>
        </ul>
      </div>
    </div>
  );
}
