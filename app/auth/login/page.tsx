"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: "Oops! Ada yang terlewat 😅",
        description: "Mohon isi email dan password kamu ya!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage (in real app, use proper session management)
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: `Selamat datang kembali, ${data.user.fullName}! 👋`,
          description: "Siap melanjutkan perjalanan hidup sehat kamu?",
        });

        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      toast({
        title: "Login gagal 😔",
        description:
          error.message || "Email atau password salah. Coba lagi ya!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Selamat Datang! 👋
          </h1>
          <p className="text-gray-600">
            Login ke akun kamu dan lanjutkan perjalanan hidup sehat
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">Masuk ke Akun</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
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
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Masukkan password kamu"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="text-emerald-600 hover:text-emerald-700">
                    Lupa password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold"
                disabled={isLoading}>
                {isLoading ? "Sedang masuk..." : "🚀 Masuk Sekarang"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/auth/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Demo Accounts:
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>👤 User: user@seacatering.id / User123!</div>
                <div>👑 Admin: admin@seacatering.id / Admin123!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
