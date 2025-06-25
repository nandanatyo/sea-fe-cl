"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
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
            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {}
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
