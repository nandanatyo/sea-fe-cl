"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFormValidation } from "@/lib/hooks/use-form-validation";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { PasswordInput } from "./password-input";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export function LoginForm() {
  const { login, loading } = useAuth();
  const { values, errors, setValue, validate, reset } = useFormValidation(
    initialValues,
    loginSchema
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    await login(values);
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
          error={errors.email}
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
          error={errors.password}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold">
        {loading ? "Sedang masuk..." : "🚀 Masuk Sekarang"}
      </Button>
    </form>
  );
}
