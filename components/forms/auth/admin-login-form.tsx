"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useFormValidation } from "@/lib/hooks/use-form-validation";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { PasswordInput } from "./password-input";
import { RetryButton } from "@/components/common/retry-button";
import { notifications } from "@/lib/utils/notifications";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { values, errors, setValue, validate, reset } = useFormValidation(
    initialValues,
    loginSchema
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);

    const isValid = await validate();
    if (!isValid) return;

    try {
      setLoading(true);
      console.log("🔐 Admin login attempt:", { email: values.email });

      // Hit admin login endpoint
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
      const response = await fetch(`${baseUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      console.log("🔐 Admin login response status:", response.status);

      const data = await response.json();
      console.log("🔐 Admin login response data:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Admin login failed");
      }

      if (data.success || data.user) {
        // Store token and user data
        if (data.access_token || data.token) {
          localStorage.setItem("access_token", data.access_token || data.token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Success notification
        notifications.success({
          title: `Selamat datang, Admin ${
            data.user?.name || data.user?.fullName
          }! 👑`,
          description: "Login admin berhasil! Dashboard siap digunakan",
          duration: 5000,
        });

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("🔐 Admin login error:", error);
      setHasError(true);

      notifications.error({
        title: "Login admin gagal 😔",
        description:
          error.message || "Periksa kembali email dan password admin",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    reset();
    // Focus on first input
    const firstInput = document.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    if (firstInput) firstInput.focus();
  };

  // Quick fill for development
  const handleQuickFill = () => {
    setValue("email", "admin@seacatering.id");
    setValue("password", "Admin123!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label
          htmlFor="email"
          className="text-base font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Administrator
        </Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          placeholder="admin@seacatering.id"
          className="mt-2 h-12"
          disabled={loading}
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
          Password Administrator
        </Label>
        <PasswordInput
          value={values.password}
          onChange={(value) => setValue("password", value)}
          placeholder="Masukkan password admin"
          className="mt-2 h-12"
          disabled={loading}
          error={errors.password}
        />
      </div>

      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">
              Gagal login admin. Periksa kembali email dan password.
            </p>
            <RetryButton onRetry={handleRetry} size="sm">
              Coba Lagi
            </RetryButton>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !values.email || !values.password}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sedang masuk sebagai admin...
          </>
        ) : (
          "🚀 Masuk sebagai Admin"
        )}
      </Button>

      {/* Quick Fill Button for Development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleQuickFill}
            className="w-full">
            🛠️ Quick Fill Demo Admin
          </Button>
        </div>
      )}

      {/* API Endpoint Info for Development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600">
            <strong>API Endpoint:</strong>{" "}
            {process.env.NEXT_PUBLIC_API_BASE_URL ||
              "http://localhost:8080/api/v1"}
            /admin/login
          </p>
        </div>
      )}
    </form>
  );
}
