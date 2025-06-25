"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Pause, X, Play } from "lucide-react";
import { Subscription } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { MEAL_PLANS, MEAL_TYPES, DELIVERY_DAYS } from "@/lib/constants";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onPause?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReactivate?: (id: string) => void;
  type: "active" | "paused" | "cancelled";
}

export function SubscriptionList({
  subscriptions,
  onPause,
  onCancel,
  onReactivate,
  type,
}: SubscriptionListProps) {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const getPlan = (planId: string) => {
    return MEAL_PLANS.find((p) => p.id === planId);
  };

  const getMealTypeNames = (mealTypeIds: string[]) => {
    return mealTypeIds
      .map((id) => MEAL_TYPES.find((mt) => mt.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getDeliveryDayNames = (dayIds: string[]) => {
    return dayIds
      .map((id) => DELIVERY_DAYS.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getStatusBadge = (subscription: Subscription) => {
    switch (subscription.status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "paused":
        return <Badge className="bg-orange-100 text-orange-800">Dijeda</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Dibatalkan</Badge>;
      default:
        return null;
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada langganan{" "}
        {type === "active"
          ? "aktif"
          : type === "paused"
          ? "yang dijeda"
          : "yang dibatalkan"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => {
        const plan = getPlan(subscription.plan);

        return (
          <Card key={subscription.id} className="border-2 border-emerald-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan?.emoji} {plan?.name} - {subscription.name}
                    </h3>
                    {getStatusBadge(subscription)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📅 Mulai: {formatDate(subscription.createdAt)}</span>
                    <span>🍽️ {subscription.mealTypes.length} waktu makan</span>
                    <span>
                      📦 {subscription.deliveryDays.length} hari/minggu
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      📍 {subscription.address}, {subscription.city}
                    </p>
                    <p>📞 {subscription.phone}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                  {formatCurrency(subscription.totalPrice)}/bulan
                </Badge>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubscription(subscription)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Detail Langganan</DialogTitle>
                    </DialogHeader>
                    {selectedSubscription && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Informasi Umum
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <strong>Nama:</strong>{" "}
                                {selectedSubscription.name}
                              </p>
                              <p>
                                <strong>Telepon:</strong>{" "}
                                {selectedSubscription.phone}
                              </p>
                              <p>
                                <strong>Paket:</strong> {plan?.name}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                {selectedSubscription.status}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">
                              Alamat Pengiriman
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p>{selectedSubscription.address}</p>
                              <p>{selectedSubscription.city}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Detail Langganan
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Waktu Makan:</strong>{" "}
                              {getMealTypeNames(selectedSubscription.mealTypes)}
                            </p>
                            <p>
                              <strong>Hari Pengiriman:</strong>{" "}
                              {getDeliveryDayNames(
                                selectedSubscription.deliveryDays
                              )}
                            </p>
                            <p>
                              <strong>Total Harga:</strong>{" "}
                              {formatCurrency(selectedSubscription.totalPrice)}
                              /bulan
                            </p>
                            {selectedSubscription.allergies && (
                              <p>
                                <strong>Alergi/Pantangan:</strong>{" "}
                                {selectedSubscription.allergies}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Tanggal Penting
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Dibuat:</strong>{" "}
                              {formatDate(selectedSubscription.createdAt)}
                            </p>
                            {selectedSubscription.pauseUntil && (
                              <p>
                                <strong>Dijeda sampai:</strong>{" "}
                                {formatDate(selectedSubscription.pauseUntil)}
                              </p>
                            )}
                            {selectedSubscription.cancelledAt && (
                              <p>
                                <strong>Dibatalkan:</strong>{" "}
                                {formatDate(selectedSubscription.cancelledAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {type === "active" && onPause && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-200"
                    onClick={() => onPause(subscription.id)}>
                    <Pause className="h-4 w-4 mr-2" />
                    Jeda
                  </Button>
                )}

                {type === "active" && onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200"
                    onClick={() => onCancel(subscription.id)}>
                    <X className="h-4 w-4 mr-2" />
                    Batalkan
                  </Button>
                )}

                {(type === "paused" || type === "cancelled") &&
                  onReactivate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200"
                      onClick={() => onReactivate(subscription.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Aktifkan Lagi
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
