"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MEAL_TYPES } from "@/lib/constants";

interface MealTypeSelectorProps {
  selectedMealTypes: string[];
  onMealTypeChange: (mealTypeId: string, checked: boolean) => void;
}

export function MealTypeSelector({
  selectedMealTypes,
  onMealTypeChange,
}: MealTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 font-bold">3</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Waktu Makan *</h3>
      </div>
      <p className="text-gray-600">Pilih minimal 1 waktu makan</p>

      <div className="grid md:grid-cols-3 gap-4">
        {MEAL_TYPES.map((mealType) => (
          <div
            key={mealType.id}
            className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50">
            <Checkbox
              id={mealType.id}
              checked={selectedMealTypes.includes(mealType.id)}
              onCheckedChange={(checked) =>
                onMealTypeChange(mealType.id, !!checked)
              }
            />
            <div className="flex-1">
              <Label
                htmlFor={mealType.id}
                className="flex items-center gap-2 cursor-pointer">
                <span className="text-xl">{mealType.emoji}</span>
                <div>
                  <div className="font-semibold">{mealType.name}</div>
                  <div className="text-sm text-gray-500">{mealType.time}</div>
                </div>
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
