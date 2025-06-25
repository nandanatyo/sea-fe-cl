"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, XCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFormValidation } from "@/lib/hooks/use-form-validation";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { PasswordInput } from "./password-input";
import { PasswordRequirements } from "./password-requirements";

const initialValues: RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const { register: registerUser, loading } = useAuth();
  const { values, errors, setValue, validate } = useFormValidation(
    initialValues,
    registerSchema
  );

  const isPasswordValid = () => {
    return (
      values.password.length >= 8 &&
      /[A-Z]/.test(values.password) &&
      /[a-z]/.test(values.password) &&
      /\d/.test(values.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(values.password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    if (!isPasswordValid()) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      return;
    }

    await registerUser({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
  };

  return (
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
          value={values.fullName}
          onChange={(e) => setValue("fullName", e.target.value)}
          placeholder="Masukkan nama lengkap kamu"
          className="mt-2 h-12"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
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
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          placeholder="nama@email.com"
          className="mt-2 h-12"
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
          Password *
        </Label>
        <PasswordInput
          value={values.password}
          onChange={(value) => setValue("password", value)}
          placeholder="Buat password yang kuat"
          className="mt-2 h-12"
        />
        <PasswordRequirements password={values.password} />
      </div>

      <div>
        <Label
          htmlFor="confirmPassword"
          className="text-base font-semibold flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Konfirmasi Password *
        </Label>
        <PasswordInput
          value={values.confirmPassword}
          onChange={(value) => setValue("confirmPassword", value)}
          placeholder="Ketik ulang password kamu"
          className="mt-2 h-12"
        />
        {values.confirmPassword &&
          values.password !== values.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Password tidak cocok
            </p>
          )}
      </div>

      <Button
        type="submit"
        disabled={
          loading ||
          !isPasswordValid() ||
          values.password !== values.confirmPassword
        }
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 text-lg font-semibold">
        {loading ? "Mendaftarkan..." : "🎉 Daftar Sekarang"}
      </Button>
    </form>
  );
}
