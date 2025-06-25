import { type NextRequest, NextResponse } from "next/server";

// Mock testimonials storage
const testimonials = [];

export async function POST(request: NextRequest) {
  try {
    const { customerName, email, plan, reviewMessage, rating, location } =
      await request.json();

    // Validation
    if (!customerName || !email || !reviewMessage || !rating) {
      return NextResponse.json(
        { error: "Field wajib tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    if (reviewMessage.length < 50) {
      return NextResponse.json(
        { error: "Review minimal 50 karakter" },
        { status: 400 }
      );
    }

    // Create testimonial
    const newTestimonial = {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      email,
      plan,
      reviewMessage,
      rating,
      location,
      approved: false, // Needs admin approval
      createdAt: new Date().toISOString(),
    };

    testimonials.push(newTestimonial);

    return NextResponse.json({
      message: "Testimoni berhasil dikirim",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("Testimonial submission error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return approved testimonials only
  const approvedTestimonials = testimonials.filter((t) => t.approved);
  return NextResponse.json({ testimonials: approvedTestimonials });
}
