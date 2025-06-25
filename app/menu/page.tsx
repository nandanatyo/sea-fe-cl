"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Clock, Users, Utensils, Award, Flame } from "lucide-react";
import Link from "next/link";

const mealPlans = [
  {
    id: 1,
    name: "Diet Plan",
    subtitle: "Si Langsing Sehat",
    price: 30000,
    originalPrice: 35000,
    description:
      "Menu spesial untuk kamu yang ingin turun berat badan tanpa tersiksa! Dengan resep rahasia nenek yang dimodifikasi ahli gizi.",
    image: "/placeholder.svg?height=250&width=350",
    features: [
      "🌾 Nasi merah organik dari Cianjur",
      "🥬 Sayuran hidroponik segar",
      "🍗 Protein tanpa lemak berlebih",
      "👩‍⚕️ Disetujui ahli gizi Indonesia",
    ],
    sampleMenus: [
      "Ayam Bakar Bumbu Bali + Nasi Merah + Gado-gado Mini",
      "Ikan Kakap Asam Manis + Tumis Kangkung + Buah Naga",
      "Tahu Tempe Bacem + Sayur Asem + Pisang Rebus",
    ],
    calories: "350-450 kalori",
    servings: "1 porsi pas",
    prepTime: "Siap santap",
    popular: false,
    badge: "💚 Favorit Ibu-ibu",
  },
  {
    id: 2,
    name: "Protein Plan",
    subtitle: "Si Jagoan Otot",
    price: 40000,
    originalPrice: 45000,
    description:
      "Khusus untuk kamu yang aktif olahraga atau ingin membentuk otot. Menu high-protein dengan cita rasa Indonesia yang bikin nagih!",
    image: "/placeholder.svg?height=250&width=350",
    features: [
      "🥩 Daging sapi pilihan grade A",
      "🐟 Ikan salmon & tuna segar",
      "🥚 Telur omega-3 premium",
      "💪 Formula khusus muscle building",
    ],
    sampleMenus: [
      "Rendang Protein + Quinoa + Salad Alpukat",
      "Salmon Teriyaki + Nasi Shirataki + Edamame",
      "Ayam Geprek Sehat + Sweet Potato + Smoothie Protein",
    ],
    calories: "500-650 kalori",
    servings: "1 porsi jumbo",
    prepTime: "Siap santap",
    popular: true,
    badge: "🔥 Paling Laris",
  },
  {
    id: 3,
    name: "Royal Plan",
    subtitle: "Si Mewah Bergizi",
    price: 60000,
    originalPrice: 75000,
    description:
      "Menu premium dengan bahan-bahan terbaik! Rasakan pengalaman fine dining sehat di rumah dengan sentuhan chef berpengalaman.",
    image: "/placeholder.svg?height=250&width=350",
    features: [
      "👑 Bahan premium imported",
      "👨‍🍳 Dimasak chef berpengalaman",
      "🍽️ Presentasi restaurant-quality",
      "✨ Limited edition recipes",
    ],
    sampleMenus: [
      "Wagyu Steak + Truffle Rice + Asparagus Grilled",
      "Lobster Thermidor + Garlic Bread + Caesar Salad",
      "Duck Confit + Mashed Potato + Ratatouille",
    ],
    calories: "600-750 kalori",
    servings: "1 porsi premium",
    prepTime: "Siap santap",
    popular: false,
    badge: "👑 Eksklusif",
  },
];

export default function MenuPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

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
            <Card
              key={plan.id}
              className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-xl relative overflow-hidden ${
                plan.popular ? "ring-4 ring-emerald-500 ring-opacity-50" : ""
              }`}>
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                    <Flame className="h-3 w-3 mr-1" />
                    TERLARIS
                  </Badge>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-700 shadow-md">
                  {plan.badge}
                </Badge>
              </div>

              <CardHeader className="pb-4 relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={plan.image || "/placeholder.svg"}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <p className="text-emerald-600 font-semibold text-lg">
                    {plan.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-emerald-600">
                      Rp{plan.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      Rp{plan.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      HEMAT{" "}
                      {Math.round(
                        ((plan.originalPrice - plan.price) /
                          plan.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {plan.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Utensils className="h-5 w-5 mx-auto text-emerald-600" />
                    <div className="text-xs text-gray-500">{plan.calories}</div>
                  </div>
                  <div className="space-y-1">
                    <Users className="h-5 w-5 mx-auto text-emerald-600" />
                    <div className="text-xs text-gray-500">{plan.servings}</div>
                  </div>
                  <div className="space-y-1">
                    <Clock className="h-5 w-5 mx-auto text-emerald-600" />
                    <div className="text-xs text-gray-500">{plan.prepTime}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    Keunggulan:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        👀 Lihat Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {plan.name} - {plan.subtitle}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <img
                          src={plan.image || "/placeholder.svg"}
                          alt={plan.name}
                          className="w-full h-64 object-cover rounded-xl"
                        />

                        <div className="bg-emerald-50 p-6 rounded-xl">
                          <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                            🍽️ Contoh Menu Mingguan:
                          </h4>
                          <ul className="space-y-2">
                            {plan.sampleMenus.map((menu, index) => (
                              <li
                                key={index}
                                className="text-emerald-700 flex items-start gap-2">
                                <span className="font-bold text-emerald-600">
                                  Day {index + 1}:
                                </span>
                                {menu}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">
                            Keunggulan Lengkap:
                          </h4>
                          <div className="grid gap-3">
                            {plan.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Star className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-xl text-center">
                          <div className="text-3xl font-bold mb-2">
                            Rp{plan.price.toLocaleString()}/hari
                          </div>
                          <div className="text-emerald-100">
                            Hemat Rp
                            {(
                              plan.originalPrice - plan.price
                            ).toLocaleString()}{" "}
                            dari harga normal!
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                    <Link href="/subscription">🚀 Pilih Paket</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Masih Bingung Pilih Yang Mana? 🤔
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Konsultasi GRATIS dengan ahli gizi kami! Kami akan bantu kamu pilih
            paket yang paling cocok dengan kondisi kesehatan dan target kamu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/consultation">💬 Konsultasi Gratis</Link>
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
      </div>
    </div>
  );
}
