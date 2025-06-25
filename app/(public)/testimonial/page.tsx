"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestimonialForm } from "@/components/forms/testimonial/testimonial-form";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { MessageSquare, Users, Star, TrendingUp } from "lucide-react";

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshCarousel, setRefreshCarousel] = useState(0);

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshCarousel((prev) => prev + 1);
  };

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: "50,000+",
      label: "Pelanggan Puas",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: "4.9/5",
      label: "Rating Rata-rata",
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      value: "15,000+",
      label: "Testimoni Positif",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: "98%",
      label: "Tingkat Kepuasan",
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-amber-100 text-amber-800 text-sm px-4 py-2">
            💬 Cerita Sukses Keluarga Indonesia
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Testimoni Pelanggan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Dengarkan langsung dari keluarga Indonesia yang sudah merasakan
            perubahan hidup sehat bersama SEA Catering
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <MessageSquare className="h-5 w-5 mr-2" />
              {showForm ? "Lihat Testimoni" : "📝 Bagikan Pengalaman Kamu"}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {showForm ? (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Bagikan Pengalaman Kamu
                </h2>
                <p className="text-lg text-gray-600">
                  Cerita kamu bisa membantu orang lain memutuskan untuk hidup
                  lebih sehat!
                </p>
              </div>
              <TestimonialForm onSuccess={handleFormSuccess} />
            </div>
          ) : (
            <>
              {/* Testimonial Carousel */}
              <TestimonialCarousel key={refreshCarousel} />

              {/* Call to Action */}
              <div className="text-center mt-16">
                <div className="bg-white rounded-3xl p-12 shadow-xl">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Punya Cerita Seru dengan SEA Catering? 📝
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Yuk bagikan pengalaman kamu! Cerita kamu bisa menginspirasi
                    ribuan orang lain untuk memulai hidup sehat.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                    <MessageSquare className="h-5 w-5 mr-2" />✨ Tulis Testimoni
                    Sekarang
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Testimoni Kamu Penting?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Membantu Orang Lain
              </h3>
              <p className="text-gray-600">
                Cerita kamu bisa membantu orang lain membuat keputusan untuk
                hidup lebih sehat
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Membangun Komunitas
              </h3>
              <p className="text-gray-600">
                Bergabung dengan komunitas keluarga sehat Indonesia yang saling
                mendukung
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Meningkatkan Kualitas
              </h3>
              <p className="text-gray-600">
                Feedback kamu membantu kami terus meningkatkan kualitas layanan
                SEA Catering
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
