"use client";

import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export function EmptySubscriptions() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="h-12 w-12 text-emerald-600" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Belum Ada Langganan Aktif
      </h3>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Waktunya memulai perjalanan hidup sehat! Pilih paket makanan yang sesuai
        dengan kebutuhan dan target kesehatan kamu.
      </p>

      <div className="space-y-4">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Link href="/subscription">
            <Sparkles className="h-5 w-5 mr-2" />
            🚀 Mulai Langganan Sekarang
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-gray-500">
          <span>✅ Gratis konsultasi gizi</span>
          <span>✅ Gratis ongkir</span>
          <span>✅ Garansi uang kembali</span>
        </div>
      </div>
    </div>
  );
}
