// components/testimonial-carousel.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { testimonialService } from "@/lib/api/testimonials";
import { convertTestimonialFromBackend, type Testimonial } from "@/lib/types";
import { MEAL_PLANS } from "@/lib/constants";

// Fallback testimonials if no data from backend
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Ibu Sari Dewi",
    customer_name: "Ibu Sari Dewi",
    email: "sari@example.com",
    location: "Jakarta Selatan",
    rating: 5,
    reviewMessage:
      "Sebagai ibu bekerja, SEA Catering benar-benar menyelamatkan hidup saya! Anak-anak suka banget sama menu 'Ayam Bakar Madu' nya. Rasanya kayak masakan rumah tapi lebih sehat. Suami juga turun 5kg dalam 2 bulan! 😍",
    message:
      "Sebagai ibu bekerja, SEA Catering benar-benar menyelamatkan hidup saya! Anak-anak suka banget sama menu 'Ayam Bakar Madu' nya. Rasanya kayak masakan rumah tapi lebih sehat. Suami juga turun 5kg dalam 2 bulan! 😍",
    plan: "royal",
    approved: true,
    is_approved: true,
    created_at: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    customerName: "Pak Budi Hartono",
    customer_name: "Pak Budi Hartono",
    email: "budi@example.com",
    location: "Surabaya",
    rating: 5,
    reviewMessage:
      "Awalnya skeptis sama makanan sehat, takut hambar. Ternyata salah besar! Menu 'Rendang Protein' nya juara banget. Diabetes saya jadi terkontrol, istri juga ikutan langsing. Recommended banget deh! 👍",
    message:
      "Awalnya skeptis sama makanan sehat, takut hambar. Ternyata salah besar! Menu 'Rendang Protein' nya juara banget. Diabetes saya jadi terkontrol, istri juga ikutan langsing. Recommended banget deh! 👍",
    plan: "protein",
    approved: true,
    is_approved: true,
    created_at: "2024-01-10T10:00:00Z",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    customerName: "Mbak Fitri Ramadhani",
    customer_name: "Mbak Fitri Ramadhani",
    email: "fitri@example.com",
    location: "Bandung",
    rating: 5,
    reviewMessage:
      "Sebagai mahasiswa yang kost, ini solusi banget! Harganya masuk akal, makanannya enak, dan yang penting halal. Menu 'Gado-gado Sehat' nya bikin kangen rumah. Delivery nya juga selalu tepat waktu! 🙏",
    message:
      "Sebagai mahasiswa yang kost, ini solusi banget! Harganya masuk akal, makanannya enak, dan yang penting halal. Menu 'Gado-gado Sehat' nya bikin kangen rumah. Delivery nya juga selalu tepat waktu! 🙏",
    plan: "diet",
    approved: true,
    is_approved: true,
    created_at: "2024-01-05T10:00:00Z",
    createdAt: "2024-01-05T10:00:00Z",
  },
];

export function TestimonialCarousel() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialService.getApproved();

        if (response.success && response.data && response.data.length > 0) {
          const convertedTestimonials = response.data.map(
            convertTestimonialFromBackend
          );
          setTestimonials(convertedTestimonials);
        } else {
          // Use fallback data if no testimonials from backend
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Use fallback data on error
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

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

  const getPlanName = (planId: string) => {
    const plan = MEAL_PLANS.find((p) => p.id === planId);
    return plan ? plan.name : planId;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cerita Sukses Keluarga Indonesia 🇮🇩
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Belum ada testimoni yang tersedia. Jadilah yang pertama berbagi
            pengalaman!
          </p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

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
                      {getInitials(
                        currentTestimonial.customerName ||
                          currentTestimonial.customer_name
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {currentTestimonial.customerName ||
                          currentTestimonial.customer_name}
                      </h3>
                      <p className="text-gray-600">
                        {currentTestimonial.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(currentTestimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-emerald-600 font-semibold">
                          {getPlanName(currentTestimonial.plan)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                    "
                    {currentTestimonial.reviewMessage ||
                      currentTestimonial.message}
                    "
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>

          {testimonials.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
}
