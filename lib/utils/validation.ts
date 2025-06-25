export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIndonesianPhone = (phone: string): boolean => {
  const phoneRegex = /^08[0-9]{8,11}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password minimal 8 karakter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password harus mengandung huruf besar");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password harus mengandung huruf kecil");
  }

  if (!/\d/.test(password)) {
    errors.push("Password harus mengandung angka");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password harus mengandung karakter khusus");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};
