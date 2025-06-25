"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "new_subscription" | "payment" | "reactivation" | "testimonial";
  title: string;
  description: string;
  time: string;
  badge: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "new_subscription",
    title: "Langganan baru dari Jakarta",
    description: "Ibu Sarah memilih Royal Plan - 2 jam yang lalu",
    time: "2 jam yang lalu",
    badge: {
      text: "Baru",
      variant: "secondary",
      className: "bg-green-100 text-green-800",
    },
  },
  {
    id: "2",
    type: "payment",
    title: "Pembayaran berhasil",
    description: "Pak Budi - Protein Plan Rp1.720.000 - 3 jam yang lalu",
    time: "3 jam yang lalu",
    badge: {
      text: "Pembayaran",
      variant: "secondary",
      className: "bg-blue-100 text-blue-800",
    },
  },
  {
    id: "3",
    type: "reactivation",
    title: "Reaktivasi langganan",
    description: "Mbak Fitri mengaktifkan kembali Diet Plan - 5 jam yang lalu",
    time: "5 jam yang lalu",
    badge: {
      text: "Reaktivasi",
      variant: "secondary",
      className: "bg-purple-100 text-purple-800",
    },
  },
  {
    id: "4",
    type: "testimonial",
    title: "Testimoni baru",
    description: "Rating 5 bintang dari Pak Ahmad - 1 hari yang lalu",
    time: "1 hari yang lalu",
    badge: {
      text: "Testimoni",
      variant: "secondary",
      className: "bg-orange-100 text-orange-800",
    },
  },
];

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "new_subscription":
      return "bg-green-500";
    case "payment":
      return "bg-blue-500";
    case "reactivation":
      return "bg-purple-500";
    case "testimonial":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export function ActivityFeed() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru 📊</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div
                className={`w-2 h-2 ${getActivityColor(
                  activity.type
                )} rounded-full`}></div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <Badge
                variant={activity.badge.variant}
                className={activity.badge.className}>
                {activity.badge.text}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
