"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ibu Sari Dewi",
    location: "Jakarta Selatan",
    rating: 5,
    review:
      "Sebagai ibu bekerja, SEA Catering benar-benar menyelamatkan hidup saya! Anak-anak suka banget sama menu 'Ayam Bakar Madu' nya. Rasanya kayak masakan rumah tapi lebih sehat. Suami juga turun 5kg dalam 2 bulan! 😍",
    plan: "Royal Plan",
    avatar: "SD",
  },
  {
    name: "Pak Budi Hartono",
    location: "Surabaya",
    rating: 5,
    review:
      "Awalnya skeptis sama makanan sehat, takut hambar. Ternyata salah besar! Menu 'Rendang Protein' nya juara banget. Diabetes saya jadi terkontrol, istri juga ikutan langsing. Recommended banget deh! 👍",
    plan: "Protein Plan",
    avatar: "BH",
  },
  {
    name: "Mbak Fitri Ramadhani",
    location: "Bandung",
    rating: 5,
    review:
      "Sebagai mahasiswa yang kost, ini solusi banget! Harganya masuk akal, makanannya enak, dan yang penting halal. Menu 'Gado-gado Sehat' nya bikin kangen rumah. Delivery nya juga selalu tepat waktu! 🙏",
    plan: "Diet Plan",
    avatar: "FR",
  },
  {
    name: "Dr. Amanda Putri",
    location: "Medan",
    rating: 5,
    review:
      "Sebagai dokter, saya sangat merekomendasikan SEA Catering. Komposisi nutrisinya benar-benar seimbang. Pasien-pasien saya yang subscribe juga menunjukkan progress kesehatan yang signifikan. Two thumbs up! 👩‍⚕️",
    plan: "Royal Plan",
    avatar: "AP",
  },
  {
    name: "Mas Agung Prasetyo",
    location: "Yogyakarta",
    rating: 4,
    review:
      "Gym buddy saya yang rekomendasiin. Setelah 3 bulan, berat badan ideal, otot terbentuk, dan yang paling penting energi untuk kerja jadi lebih stabil. Menu 'Salmon Teriyaki' nya favorit banget! 💪",
    plan: "Protein Plan",
    avatar: "AP",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cerita Sukses Keluarga Indonesia 🇮🇩
          </h2>
          <p className="text-xl text-gray-600">
            Dengarkan langsung dari mereka yang sudah merasakan perubahan hidup
            sehat
          </p>
        </div>

        <div className="relative">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0">
            <CardContent className="p-12">
              <div className="flex items-start gap-6">
                <Quote className="h-12 w-12 text-emerald-500 flex-shrink-0 mt-2" />
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-gray-600">
                        {testimonials[currentIndex].location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(testimonials[currentIndex].rating)].map(
                            (_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            )
                          )}
                        </div>
                        <span className="text-sm text-emerald-600 font-semibold">
                          {testimonials[currentIndex].plan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                    "{testimonials[currentIndex].review}"
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="rounded-full w-12 h-12 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-emerald-500 w-8"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="rounded-full w-12 h-12 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
