"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    validatePassword(password);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      toast({
        title: "Oops! Ada yang terlewat 😅",
        description: "Mohon lengkapi semua field yang wajib diisi ya!",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Password belum memenuhi syarat 🔒",
        description:
          "Pastikan password kamu sudah sesuai dengan kriteria di bawah!",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password tidak cocok 🤔",
        description:
          "Pastikan konfirmasi password sama dengan password yang kamu masukkan!",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Selamat datang di keluarga SEA Catering! 🎉",
          description:
            "Akun kamu berhasil dibuat. Silakan login untuk mulai hidup sehat!",
        });
        router.push("/auth/login");
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Waduh, ada kendala teknis 😔",
        description: error.message || "Coba lagi dalam beberapa saat ya!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Gabung Yuk! 🚀
          </h1>
          <p className="text-gray-600">
            Daftar sekarang dan mulai hidup sehat bersama 50,000+ keluarga
            Indonesia
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">
              Buat Akun Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nama Lengkap *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Masukkan nama lengkap kamu"
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="nama@email.com"
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password *
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Buat password yang kuat"
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Password harus mengandung:
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {[
                      { key: "length", text: "Minimal 8 karakter" },
                      { key: "uppercase", text: "Huruf besar (A-Z)" },
                      { key: "lowercase", text: "Huruf kecil (a-z)" },
                      { key: "number", text: "Angka (0-9)" },
                      { key: "special", text: "Karakter khusus (!@#$%^&*)" },
                    ].map((req) => (
                      <div key={req.key} className="flex items-center gap-2">
                        {passwordValidation[req.key] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-300" />
                        )}
                        <span
                          className={
                            passwordValidation[req.key]
                              ? "text-green-600"
                              : "text-gray-500"
                          }>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Konfirmasi Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Ketik ulang password kamu"
                  className="mt-2 h-12"
                  required
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Password tidak cocok
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold"
                disabled={
                  !isPasswordValid ||
                  formData.password !== formData.confirmPassword
                }>
                🎉 Daftar Sekarang
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/auth/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Login di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
