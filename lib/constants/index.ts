import { Plan } from "@/lib/types";

export const MEAL_PLANS: Plan[] = [
  {
    id: "diet",
    name: "Diet Plan",
    subtitle: "Si Langsing Sehat",
    price: 30000,
    originalPrice: 35000,
    description:
      "Menu spesial untuk kamu yang ingin turun berat badan tanpa tersiksa!",
    emoji: "💚",
    features: [
      "🌾 Nasi merah organik dari Cianjur",
      "🥬 Sayuran hidroponik segar",
      "🍗 Protein tanpa lemak berlebih",
      "👩‍⚕️ Disetujui ahli gizi Indonesia",
    ],
    sampleMenus: [
      "Ayam Bakar Bumbu Bali + Nasi Merah + Gado-gado Mini",
      "Ikan Kakap Asam Manis + Tumis Kangkung + Buah Naga",
      "Tahu Tempe Bacem + Sayur Asem + Pisang Rebus",
    ],
    calories: "350-450 kalori",
    servings: "1 porsi pas",
    prepTime: "Siap santap",
    popular: false,
    badge: "💚 Favorit Ibu-ibu",
  },
  {
    id: "protein",
    name: "Protein Plan",
    subtitle: "Si Jagoan Otot",
    price: 40000,
    originalPrice: 45000,
    description:
      "Khusus untuk kamu yang aktif olahraga atau ingin membentuk otot.",
    emoji: "💪",
    features: [
      "🥩 Daging sapi pilihan grade A",
      "🐟 Ikan salmon & tuna segar",
      "🥚 Telur omega-3 premium",
      "💪 Formula khusus muscle building",
    ],
    sampleMenus: [
      "Rendang Protein + Quinoa + Salad Alpukat",
      "Salmon Teriyaki + Nasi Shirataki + Edamame",
      "Ayam Geprek Sehat + Sweet Potato + Smoothie Protein",
    ],
    calories: "500-650 kalori",
    servings: "1 porsi jumbo",
    prepTime: "Siap santap",
    popular: true,
    badge: "🔥 Paling Laris",
  },
  {
    id: "royal",
    name: "Royal Plan",
    subtitle: "Si Mewah Bergizi",
    price: 60000,
    originalPrice: 75000,
    description: "Menu premium dengan bahan-bahan terbaik!",
    emoji: "👑",
    features: [
      "👑 Bahan premium imported",
      "👨‍🍳 Dimasak chef berpengalaman",
      "🍽️ Presentasi restaurant-quality",
      "✨ Limited edition recipes",
    ],
    sampleMenus: [
      "Wagyu Steak + Truffle Rice + Asparagus Grilled",
      "Lobster Thermidor + Garlic Bread + Caesar Salad",
      "Duck Confit + Mashed Potato + Ratatouille",
    ],
    calories: "600-750 kalori",
    servings: "1 porsi premium",
    prepTime: "Siap santap",
    popular: false,
    badge: "👑 Eksklusif",
  },
];

export const MEAL_TYPES = [
  { id: "breakfast", name: "Sarapan", emoji: "🌅", time: "06:00-09:00" },
  { id: "lunch", name: "Makan Siang", emoji: "☀️", time: "11:00-14:00" },
  { id: "dinner", name: "Makan Malam", emoji: "🌙", time: "17:00-20:00" },
];

export const DELIVERY_DAYS = [
  { id: "monday", name: "Senin", emoji: "📅" },
  { id: "tuesday", name: "Selasa", emoji: "📅" },
  { id: "wednesday", name: "Rabu", emoji: "📅" },
  { id: "thursday", name: "Kamis", emoji: "📅" },
  { id: "friday", name: "Jumat", emoji: "📅" },
  { id: "saturday", name: "Sabtu", emoji: "📅" },
  { id: "sunday", name: "Minggu", emoji: "📅" },
];

export const CITIES = [
  { value: "jakarta", label: "🏙️ Jakarta" },
  { value: "surabaya", label: "🌆 Surabaya" },
  { value: "bandung", label: "🏔️ Bandung" },
  { value: "medan", label: "🌴 Medan" },
  { value: "yogyakarta", label: "🏛️ Yogyakarta" },
  { value: "semarang", label: "🌊 Semarang" },
  { value: "makassar", label: "🏖️ Makassar" },
  { value: "palembang", label: "🌉 Palembang" },
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  SUBSCRIPTIONS: {
    BASE: "/api/subscriptions",
    PAUSE: (id: string) => `/api/subscriptions/${id}/pause`,
    CANCEL: (id: string) => `/api/subscriptions/${id}/cancel`,
    REACTIVATE: (id: string) => `/api/subscriptions/${id}/reactivate`,
  },
  ADMIN: {
    METRICS: "/api/admin/metrics",
    USERS: "/api/admin/users",
  },
  TESTIMONIALS: "/api/testimonials",
} as const;

export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  SUBSCRIPTION: "/subscription",
  CONTACT: "/contact",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  DASHBOARD: {
    USER: "/dashboard",
    ADMIN: "/admin/dashboard",
  },
} as const;
