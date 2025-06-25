import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Award, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { FloatingElements } from "@/components/floating-elements";

export default function HomePage() {
  const uniqueFeatures = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Resep Nenek yang Dimodernisasi",
      description:
        "Kami menggabungkan resep tradisional Indonesia dengan nutrisi modern untuk cita rasa yang familiar namun sehat",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Dari Sabang sampai Merauke",
      description:
        "Melayani 34 provinsi di Indonesia dengan armada khusus yang menjaga kesegaran makanan",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Sertifikat Halal & BPOM",
      description:
        "Semua produk kami telah tersertifikasi halal MUI dan terdaftar di BPOM untuk keamanan konsumen",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Komunitas Sehat Indonesia",
      description:
        "Bergabung dengan 50,000+ keluarga Indonesia yang sudah merasakan hidup lebih sehat bersama kami",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />

      {/* Hero Section dengan sentuhan Indonesia */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                Dipercaya 50,000+ Keluarga Indonesia
              </span>
            </div>

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

      {/* Unique Features Section */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-100 text-emerald-800">
              🌟 Keunggulan Kami
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Mengapa Keluarga Indonesia Memilih SEA Catering?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami tidak hanya menyajikan makanan sehat, tapi juga memahami
              selera dan kebutuhan masyarakat Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div
                    className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section dengan carousel */}
      <TestimonialCarousel />

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">50,000+</div>
              <div className="text-emerald-100">Keluarga Terlayani</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">34</div>
              <div className="text-emerald-100">Provinsi di Indonesia</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">1M+</div>
              <div className="text-emerald-100">Makanan Terkirim</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">4.9/5</div>
              <div className="text-emerald-100">Rating Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section dengan sentuhan personal */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Siap Memulai Perjalanan Sehat Bersama Kami? 🌱
          </h2>

          <div className="bg-white rounded-3xl p-10 shadow-xl mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                B
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Brian Santoso
            </h3>
            <p className="text-emerald-600 font-semibold mb-4">
              Founder & Operations Manager
            </p>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <span>📱</span> <strong>WhatsApp:</strong> 08123456789
              </p>
              <p className="flex items-center justify-center gap-2">
                <span>✉️</span> <strong>Email:</strong> brian@seacatering.id
              </p>
              <p className="text-sm italic mt-4 max-w-2xl mx-auto">
                "Saya pribadi memastikan setiap makanan yang kami kirim memenuhi
                standar kualitas terbaik. Jangan ragu untuk menghubungi saya
                langsung jika ada pertanyaan atau saran!"
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Link href="/contact">💬 Hubungi Kami</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link href="/subscription">🎯 Langsung Subscribe</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
