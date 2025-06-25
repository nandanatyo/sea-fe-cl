"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Clock, Users, Utensils, Award, Flame } from "lucide-react";
import { Plan } from "@/lib/types";
import { calculateDiscount } from "@/lib/utils/calculations";
import Link from "next/link";

interface MealPlanCardProps {
  plan: Plan;
}

export function MealPlanCard({ plan }: MealPlanCardProps) {
  const [imageError, setImageError] = useState(false);
  const discount = calculateDiscount(plan.originalPrice, plan.price);

  return (
    <Card
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
          {!imageError ? (
            <img
              src={plan.image || "/placeholder.svg"}
              alt={plan.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {plan.emoji}
            </div>
          )}
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
              HEMAT {discount}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-gray-600 leading-relaxed">{plan.description}</p>

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
            {plan.features.slice(0, 3).map((feature, index) => (
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
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-8xl">
                  {plan.emoji}
                </div>

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
                    Hemat Rp{(plan.originalPrice - plan.price).toLocaleString()}{" "}
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
  );
}
