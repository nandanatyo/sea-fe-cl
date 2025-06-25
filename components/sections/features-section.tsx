import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Award, Users } from "lucide-react";

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

export function FeaturesSection() {
  return (
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
            Kami tidak hanya menyajikan makanan sehat, tapi juga memahami selera
            dan kebutuhan masyarakat Indonesia
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
  );
}
