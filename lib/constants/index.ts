// lib/constants/index.ts
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

// Updated API endpoints to match backend
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    UPLOAD_IMAGE: "/user/profile/image",
  },
  MEAL_PLANS: {
    BASE: "/meal-plans",
    ACTIVE: "/meal-plans/active",
    SEARCH: "/meal-plans/search",
    POPULAR: "/meal-plans/popular",
    BY_ID: (id: string) => `/meal-plans/${id}`,
    // Admin endpoints
    ADMIN: {
      BASE: "/meal-plans/admin",
      BY_ID: (id: string) => `/meal-plans/admin/${id}`,
      ACTIVATE: (id: string) => `/meal-plans/admin/${id}/activate`,
      DEACTIVATE: (id: string) => `/meal-plans/admin/${id}/deactivate`,
      BULK_STATUS: "/meal-plans/admin/bulk-status",
      STATS: "/meal-plans/admin/stats",
    },
  },
  SUBSCRIPTIONS: {
    BASE: "/subscriptions",
    MY: "/subscriptions/my",
    BY_ID: (id: string) => `/subscriptions/${id}`,
    PAUSE: (id: string) => `/subscriptions/${id}/pause`,
    RESUME: (id: string) => `/subscriptions/${id}/resume`,
    CANCEL: (id: string) => `/subscriptions/${id}`,
    WEBHOOK_PAYMENT: "/subscriptions/webhook/payment",
    // Admin endpoints
    ADMIN: {
      STATS: "/subscriptions/admin/stats",
      ALL: "/subscriptions/admin/all",
      PROCESS_EXPIRED: "/subscriptions/admin/process-expired",
      SEARCH: "/subscriptions/admin/search",
      FORCE_CANCEL: (id: string) => `/subscriptions/admin/${id}/force-cancel`,
    },
  },
  TESTIMONIALS: {
    BASE: "/testimonials",
    // Admin endpoints
    ADMIN: {
      ALL: "/testimonials/admin/all",
      APPROVE: (id: string) => `/testimonials/admin/${id}/approve`,
      REJECT: (id: string) => `/testimonials/admin/${id}/reject`,
      DELETE: (id: string) => `/testimonials/admin/${id}`,
    },
  },
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    DASHBOARD_FILTER: "/admin/dashboard/filter",
    TESTIMONIALS: {
      APPROVE: (id: string) => `/admin/testimonials/${id}/approve`,
      REJECT: (id: string) => `/admin/testimonials/${id}/reject`,
    },
  },
  USER_MANAGEMENT: {
    ALL: "/api/v1/admin/users",
    BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
    STATUS: (id: string) => `/api/v1/admin/users/${id}/status`,
    DELETE: (id: string) => `/api/v1/admin/users/${id}`,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  SUBSCRIPTION: "/subscription",
  CONTACT: "/contact",
  TESTIMONIAL: "/testimonial",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  DASHBOARD: {
    USER: "/dashboard",
    ADMIN: "/admin/dashboard",
  },
} as const;