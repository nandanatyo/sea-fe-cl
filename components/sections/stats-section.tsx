const stats = [
  {
    value: "50,000+",
    label: "Keluarga Terlayani",
  },
  {
    value: "34",
    label: "Provinsi di Indonesia",
  },
  {
    value: "1M+",
    label: "Makanan Terkirim",
  },
  {
    value: "4.9/5",
    label: "Rating Kepuasan",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-bold">{stat.value}</div>
              <div className="text-emerald-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
