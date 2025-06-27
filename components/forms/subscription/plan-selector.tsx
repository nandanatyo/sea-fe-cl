// components/forms/subscription/plan-selector.tsx
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
          <p className="text-gray-500">Sedang memuat paket makanan...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {availablePlans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedPlan === plan.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
              onClick={() => onPlanChange(plan.id)}>
              <CardContent className="p-4">
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
                      {plan.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {plan.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedPlan === plan.id
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300"
                    }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
