"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { AdminMetrics } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

interface MetricsCardsProps {
  metrics: AdminMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Langganan Baru",
      value: metrics.newSubscriptions,
      description: "dalam periode ini",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(metrics.monthlyRecurringRevenue),
      description: "pendapatan bulanan",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Reaktivasi",
      value: metrics.reactivations,
      description: "langganan kembali aktif",
      icon: RefreshCw,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Langganan Aktif",
      value: metrics.totalActiveSubscriptions,
      description: "saat ini",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-full`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
