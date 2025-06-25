"use client";

import { Badge } from "@/components/ui/badge";
import { SubscriptionForm } from "@/components/forms/subscription/subscription-form";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-800">
            🚀 Mulai Hidup Sehat
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Yuk, Langganan Sekarang!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tinggal isi form di bawah, dan kamu sudah selangkah lebih dekat
            dengan hidup sehat yang enak! Tim ahli gizi kami akan pastikan menu
            yang kamu terima sesuai dengan kebutuhan tubuh kamu 💪
          </p>
        </div>

        <SubscriptionForm />
      </div>
    </div>
  );
}
