"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFormValidation } from "@/lib/hooks/use-form-validation";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { PasswordInput } from "./password-input";
import { RetryButton } from "@/components/common/retry-button";
import { notifications } from "@/lib/utils/notifications";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { login, isLoginLoading, resetLoginMutation } = useAuth();
  const [hasError, setHasError] = useState(false);

  // Detect if this is admin login page
  const isAdminLogin = pathname?.startsWith("/admin");

  const { values, errors, setValue, validate, reset } = useFormValidation(
    initialValues,
    loginSchema
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    // Reset any previous mutation errors
    resetLoginMutation();

    const isValid = await validate();
    if (!isValid) return;

    try {
      // Call the login mutation - same endpoint for both user and admin
      await new Promise((resolve, reject) => {
        login(values, {
          onSuccess: (data) => {
            if (data?.user) {
              // Check user role and redirect accordingly
              if (isAdminLogin) {
                // If logging in from admin page, check if user is actually admin
                if (data.user.role === "admin") {
                  notifications.success({
                    title: `Selamat datang, Admin ${
                      data.user.name || data.user.fullName
                    }! 👑`,
                    description:
                      "Login admin berhasil! Dashboard siap digunakan",
                    duration: 5000,
                  });
                  router.push("/admin/dashboard");
                } else {
                  // User trying to access admin page - redirect to user dashboard
                  notifications.warning({
                    title: "Akses Admin Ditolak 🚫",
                    description:
                      "Anda tidak memiliki akses admin. Dialihkan ke dashboard user.",
                    duration: 5000,
                  });
                  router.push("/dashboard");
                }
              } else {
                // Regular user login - redirect based on role
                if (data.user.role === "admin") {
                  router.push("/admin/dashboard");
                } else {
                  router.push("/dashboard");
                }
              }
            }
            resolve(data);
          },
          onError: (error) => {
            setHasError(true);
            reject(error);
          },
        });
      });
    } catch (error) {
      setHasError(true);
      console.error("🔐 Login form error:", error);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    resetLoginMutation();
    // Focus on first input
    const firstInput = document.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    if (firstInput) firstInput.focus();
  };

  return (
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
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          placeholder="nama@email.com"
          className="mt-2 h-12"
          disabled={isLoginLoading}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="password"
          className="text-base font-semibold flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <PasswordInput
          value={values.password}
          onChange={(value) => setValue("password", value)}
          placeholder="Masukkan password kamu"
          className="mt-2 h-12"
          disabled={isLoginLoading}
          error={errors.password}
        />
      </div>

      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">
              {isAdminLogin
                ? "Gagal login admin. Periksa kembali email dan password."
                : "Gagal login. Periksa kembali email dan password kamu."}
            </p>
            <RetryButton onRetry={handleRetry} size="sm">
              Coba Lagi
            </RetryButton>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoginLoading || !values.email || !values.password}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold">
        {isLoginLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {isAdminLogin ? "Sedang masuk sebagai admin..." : "Sedang masuk..."}
          </>
        ) : (
          <>🚀 {isAdminLogin ? "Masuk sebagai Admin" : "Masuk Sekarang"}</>
        )}
      </Button>
    </form>
  );
}
