"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DELIVERY_DAYS } from "@/lib/constants";

interface DeliveryDaySelectorProps {
  selectedDays: string[];
  onDayChange: (dayId: string, checked: boolean) => void;
}

export function DeliveryDaySelector({
  selectedDays,
  onDayChange,
}: DeliveryDaySelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 font-bold">4</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Hari Pengiriman *</h3>
      </div>
      <p className="text-gray-600">
        Pilih hari-hari kamu mau terima makanan sehat
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DELIVERY_DAYS.map((day) => (
          <div
            key={day.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <Checkbox
              id={day.id}
              checked={selectedDays.includes(day.id)}
              onCheckedChange={(checked) => onDayChange(day.id, !!checked)}
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
  );
}
