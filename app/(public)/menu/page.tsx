"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealPlanCard } from "@/components/features/menu/meal-plan-card";
import { MEAL_PLANS } from "@/lib/constants";
import Link from "next/link";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-800 text-sm px-4 py-2">
            🍽️ Menu Pilihan Terbaik
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Paket Makanan Sehat Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dipilih khusus untuk lidah Indonesia! Setiap menu dirancang dengan
            cinta oleh chef berpengalaman dan disetujui ahli gizi untuk
            memastikan kamu tetap sehat tanpa mengorbankan kelezatan 😋
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-16">
          {MEAL_PLANS.map((plan) => (
            <MealPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-white rounded-3xl p-12 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Masih Bingung Pilih Yang Mana? 🤔
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Konsultasi GRATIS dengan ahli gizi kami! Kami akan bantu kamu
              pilih paket yang paling cocok dengan kondisi kesehatan dan target
              kamu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/contact">💬 Konsultasi Gratis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Link href="/subscription">🎯 Langsung Pilih Paket</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
