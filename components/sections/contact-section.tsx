import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ContactSection() {
  return (
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
  );
}
