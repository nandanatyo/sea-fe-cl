import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subjek wajib dipilih"),
  message: z
    .string()
    .min(1, "Pesan wajib diisi")
    .min(10, "Pesan minimal 10 karakter"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
