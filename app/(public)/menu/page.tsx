// app/(public)/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealPlanCard } from "@/components/features/menu/meal-plan-card";
import { MEAL_PLANS } from "@/lib/constants";
import { mealPlansService, type MealPlan } from "@/lib/api/meal-plans";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function MenuPage() {
  const [mealPlans, setMealPlans] = useState(MEAL_PLANS); // Fallback to static data
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoading(true);

        // Try to fetch active meal plans from backend
        const response = await mealPlansService.getActive();

        if (response.success && response.data && response.data.length > 0) {
          // Convert backend meal plans to frontend format
          const convertedPlans = response.data.map((backendPlan: MealPlan) => ({
            id: backendPlan.id,
            name: backendPlan.name,
            subtitle: `Plan Premium`, // Default subtitle
            price: backendPlan.price,
            originalPrice: Math.round(backendPlan.price * 1.2), // Calculate original price
            description: backendPlan.description,
            image: backendPlan.image_url,
            emoji: getEmojiForPlan(backendPlan.name),
            features: backendPlan.features || [],
            sampleMenus: getSampleMenusForPlan(backendPlan.name),
            calories: getCaloriesForPlan(backendPlan.name),
            servings: "1 porsi",
            prepTime: "Siap santap",
            popular: checkIfPopular(backendPlan.name),
            badge: getBadgeForPlan(backendPlan.name),
          }));

          setMealPlans(convertedPlans);
        } else {
          // Use fallback static data if no backend data
          console.log("Using fallback meal plans data");
        }
      } catch (error) {
        console.error("Failed to fetch meal plans:", error);
        toast({
          title: "Info",
          description:
            "Menggunakan data menu default. Koneksi ke server akan diperbaiki.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  // Helper functions to map backend data to frontend format
  const getEmojiForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "💚";
    if (lowerName.includes("protein")) return "💪";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "👑";
    return "🍽️";
  };

  const getSampleMenusForPlan = (name: string): string[] => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) {
      return [
        "Ayam Bakar Bumbu Bali + Nasi Merah + Gado-gado Mini",
        "Ikan Kakap Asam Manis + Tumis Kangkung + Buah Naga",
        "Tahu Tempe Bacem + Sayur Asem + Pisang Rebus",
      ];
    }
    if (lowerName.includes("protein")) {
      return [
        "Rendang Protein + Quinoa + Salad Alpukat",
        "Salmon Teriyaki + Nasi Shirataki + Edamame",
        "Ayam Geprek Sehat + Sweet Potato + Smoothie Protein",
      ];
    }
    if (lowerName.includes("royal") || lowerName.includes("premium")) {
      return [
        "Wagyu Steak + Truffle Rice + Asparagus Grilled",
        "Lobster Thermidor + Garlic Bread + Caesar Salad",
        "Duck Confit + Mashed Potato + Ratatouille",
      ];
    }
    return [
      "Menu spesial chef",
      "Hidangan bergizi seimbang",
      "Makanan segar setiap hari",
    ];
  };

  const getCaloriesForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "350-450 kalori";
    if (lowerName.includes("protein")) return "500-650 kalori";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "600-750 kalori";
    return "400-500 kalori";
  };

  const checkIfPopular = (name: string): boolean => {
    return name.toLowerCase().includes("protein");
  };

  const getBadgeForPlan = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("diet")) return "💚 Favorit Ibu-ibu";
    if (lowerName.includes("protein")) return "🔥 Paling Laris";
    if (lowerName.includes("royal") || lowerName.includes("premium"))
      return "👑 Eksklusif";
    return "✨ Recommended";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-xl h-64 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          {mealPlans.map((plan) => (
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
