import { z } from "zod";

export const testimonialSchema = z.object({
  customerName: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  plan: z.string().min(1, "Paket wajib dipilih"),
  location: z.string().min(1, "Lokasi wajib dipilih"),
  rating: z.number().min(1, "Rating wajib dipilih").max(5, "Rating maksimal 5"),
  reviewMessage: z
    .string()
    .min(1, "Review wajib diisi")
    .min(50, "Review minimal 50 karakter")
    .max(500, "Review maksimal 500 karakter"),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;
