import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(
      /^08[0-9]{8,11}$/,
      "Format nomor HP tidak valid (contoh: 08123456789)"
    ),
  plan: z.string().min(1, "Paket makanan wajib dipilih"),
  mealTypes: z.array(z.string()).min(1, "Minimal pilih 1 waktu makan"),
  deliveryDays: z.array(z.string()).min(1, "Minimal pilih 1 hari pengiriman"),
  allergies: z.string().optional(),
  address: z.string().min(1, "Alamat lengkap wajib diisi"),
  city: z.string().min(1, "Kota wajib dipilih"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
