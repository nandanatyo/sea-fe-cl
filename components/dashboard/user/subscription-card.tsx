"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pause, X } from "lucide-react";
import { Subscription } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils/format";

interface SubscriptionCardProps {
  subscription: Subscription;
  onViewDetails: () => void;
  onPause: () => void;
  onCancel: () => void;
}

export function SubscriptionCard({
  subscription,
  onViewDetails,
  onPause,
  onCancel,
}: SubscriptionCardProps) {
  return (
    <Card className="border-2 border-emerald-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {subscription.planName} - {subscription.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📅 Mulai: {formatDate(subscription.createdAt)}</span>
              <span>🍽️ {subscription.mealTypes.length} waktu makan</span>
              <span>📦 {subscription.deliveryDays.length} hari/minggu</span>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            {formatCurrency(subscription.totalPrice)}/bulan
          </Badge>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-200"
            onClick={onPause}>
            <Pause className="h-4 w-4 mr-2" />
            Jeda
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200"
            onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Batalkan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
