import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              Dipercaya 50,000+ Keluarga Indonesia
            </span>
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            SEA Catering
          </h1>

          <div className="relative">
            <p className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              "Makanan Sehat, Kapan Saja, Di Mana Saja"
            </p>
            <div className="absolute -top-2 -left-4 text-6xl text-emerald-200 font-serif">
              "
            </div>
            <div className="absolute -bottom-2 -right-4 text-6xl text-emerald-200 font-serif">
              "
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Selamat datang di SEA Catering! 🇮🇩 Kami adalah pionir layanan
            makanan sehat yang menggabungkan
            <span className="font-semibold text-emerald-600">
              {" "}
              kearifan kuliner Nusantara
            </span>{" "}
            dengan
            <span className="font-semibold text-emerald-600">
              {" "}
              standar nutrisi internasional
            </span>
            . Dari yang awalnya hanya melayani tetangga di Jakarta, kini kami
            bangga melayani seluruh Indonesia dengan komitmen menghadirkan
            makanan sehat yang tidak hanya bergizi, tapi juga
            <span className="italic">enak di lidah orang Indonesia</span>!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
              <Link href="/menu">🍽️ Jelajahi Menu Kami</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link href="/subscription">🚀 Mulai Hidup Sehat</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tersedia di 34 Provinsi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Pengiriman Same Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Halal & BPOM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
