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
import { useAuth } from "@/lib/hooks/use-auth";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function AdminLoginForm() {
  const router = useRouter();
  const { adminLogin, isAdminLoginLoading } = useAuth();
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
      await new Promise((resolve, reject) => {
        adminLogin(values, {
          onSuccess: (data) => {
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
      console.error("🔐 Admin login form error:", error);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    reset();
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
          Email Administrator
        </Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          placeholder="admin@seacatering.id"
          className="mt-2 h-12"
          disabled={isAdminLoginLoading}
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
          disabled={isAdminLoginLoading}
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
        disabled={isAdminLoginLoading || !values.email || !values.password}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold">
        {isAdminLoginLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sedang masuk sebagai admin...
          </>
        ) : (
          "🚀 Masuk sebagai Admin"
        )}
      </Button>

      {/* Demo Credentials only in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Demo Admin Account:
          </p>
          <div className="text-xs text-gray-600">
            👑 Admin: admin@seacatering.id / Admin123!
          </div>
        </div>
      )}
    </form>
  );
}
