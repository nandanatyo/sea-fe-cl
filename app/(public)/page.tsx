import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ContactSection } from "@/components/sections/contact-section";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { FloatingElements } from "@/components/floating-elements";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />

      <HeroSection />

      <FeaturesSection />

      <TestimonialCarousel />

      <StatsSection />

      <ContactSection />
    </div>
  );
}
