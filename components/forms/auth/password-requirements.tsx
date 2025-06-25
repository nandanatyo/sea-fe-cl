"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: "Minimal 8 karakter",
      met: password.length >= 8,
    },
    {
      label: "Huruf besar (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Huruf kecil (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      label: "Angka (0-9)",
      met: /\d/.test(password),
    },
    {
      label: "Karakter khusus (!@#$%^&*)",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Password harus mengandung:
      </p>
      <div className="grid grid-cols-1 gap-1 text-sm">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-300" />
            )}
            <span className={req.met ? "text-green-600" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
