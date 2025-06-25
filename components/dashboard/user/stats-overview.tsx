"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Subscription } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

interface StatsOverviewProps {
  subscriptions: Subscription[];
}

export function StatsOverview({ subscriptions }: StatsOverviewProps) {
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );
  const pausedSubscriptions = subscriptions.filter(
    (s) => s.status === "paused"
  );
  const totalMonthly = activeSubscriptions.reduce(
    (total, s) => total + s.totalPrice,
    0
  );

  const stats = [
    {
      label: "Langganan Aktif",
      value: activeSubscriptions.length,
      color: "text-emerald-600",
    },
    {
      label: "Langganan Dijeda",
      value: pausedSubscriptions.length,
      color: "text-blue-600",
    },
    {
      label: "Total Bulanan",
      value: formatCurrency(totalMonthly),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
