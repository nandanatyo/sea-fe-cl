// lib/hooks/use-auth.ts - Updated with access token only + enhanced notifications
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginData, type RegisterData } from "@/lib/api/auth";
import { adminService } from "@/lib/api/admin";
import { notifications } from "@/lib/utils/notifications";
import { User, convertUserFromBackend } from "@/lib/types";
import { ROUTES } from "@/lib/constants";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      if (authService.validateToken()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(convertUserFromBackend(currentUser));
        }
      } else {
        // Clear invalid data
        authService.removeAuthToken();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);

      const response = await authService.login(data);

      if (response.success && response.data) {
        const convertedUser = convertUserFromBackend(response.data.user);
        setUser(convertedUser);

        // Success notification
        notifications.success({
          title: `Selamat datang kembali, ${
            convertedUser.fullName || convertedUser.name
          }! 🎉`,
          description:
            "Login berhasil! Siap melanjutkan perjalanan hidup sehat?",
          duration: 5000,
        });

        // Navigate based on role
        if (convertedUser.role === "admin") {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.DASHBOARD.USER);
        }

        return true;
      } else {
        notifications.error({
          title: "Login gagal 😔",
          description: response.error || "Email/nomor HP atau password salah",
          action: {
            label: "Coba Lagi",
            onClick: () => {
              const emailInput = document.querySelector(
                'input[type="email"]'
              ) as HTMLInputElement;
              if (emailInput) emailInput.focus();
            },
          },
        });
        return false;
      }
    } catch (error) {
      notifications.error({
        title: "Login gagal",
        description:
          "Terjadi kesalahan pada server. Coba lagi dalam beberapa menit.",
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);

      const response = await adminService.login(data);

      if (response.success && response.data) {
        const convertedUser = convertUserFromBackend(response.data.user);
        setUser(convertedUser);

        notifications.success({
          title: `Selamat datang, Admin ${
            convertedUser.fullName || convertedUser.name
          }! 👑`,
          description: "Login admin berhasil! Dashboard siap digunakan",
          duration: 5000,
        });

        router.push(ROUTES.DASHBOARD.ADMIN);
        return true;
      } else {
        notifications.error({
          title: "Login admin gagal 🚫",
          description: response.error || "Email atau password admin salah",
          action: {
            label: "Hubungi IT",
            onClick: () => {
              window.open(
                "mailto:it@seacatering.id?subject=Admin Login Issue",
                "_blank"
              );
            },
          },
        });
        return false;
      }
    } catch (error) {
      notifications.serverError();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      // Convert frontend data to backend format
      const backendData: RegisterData = {
        name: data.fullName,
        phone: data.phone,
        password: data.password,
        email: data.email,
      };

      const response = await authService.register(backendData);

      if (response.success) {
        if (response.data) {
          // Auto login after successful registration
          const convertedUser = convertUserFromBackend(response.data.user);
          setUser(convertedUser);

          notifications.success({
            title: "Akun berhasil dibuat! 🎉",
            description:
              "Selamat datang di keluarga SEA Catering! Mari mulai hidup sehat!",
            duration: 6000,
            action: {
              label: "Mulai Tour",
              onClick: () => {
                // Could trigger an onboarding tour
                console.log("Start onboarding tour");
              },
            },
          });

          router.push(ROUTES.DASHBOARD.USER);
        } else {
          notifications.success({
            title: "Registrasi berhasil! 🎉",
            description: "Akun telah dibuat. Silakan login untuk melanjutkan",
            duration: 5000,
          });

          router.push(ROUTES.AUTH.LOGIN);
        }
        return true;
      } else {
        // Handle specific registration errors
        if (
          response.error?.includes("email") &&
          response.error?.includes("sudah")
        ) {
          notifications.error({
            title: "Email sudah terdaftar 📧",
            description:
              "Email ini sudah digunakan. Coba login atau gunakan email lain.",
            action: {
              label: "Login",
              onClick: () => router.push(ROUTES.AUTH.LOGIN),
            },
          });
        } else if (
          response.error?.includes("phone") &&
          response.error?.includes("sudah")
        ) {
          notifications.error({
            title: "Nomor HP sudah terdaftar 📱",
            description:
              "Nomor ini sudah digunakan. Coba login atau gunakan nomor lain.",
            action: {
              label: "Login",
              onClick: () => router.push(ROUTES.AUTH.LOGIN),
            },
          });
        } else {
          notifications.error({
            title: "Registrasi gagal 😔",
            description:
              response.error || "Terjadi kesalahan saat membuat akun",
          });
        }
        return false;
      }
    } catch (error) {
      notifications.error({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan pada server",
        action: {
          label: "Coba Lagi",
          onClick: () => window.location.reload(),
        },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeAuthToken();
    setUser(null);
    router.push(ROUTES.HOME);

    notifications.success({
      title: "Berhasil logout! 👋",
      description: "Sampai jumpa! Terima kasih sudah menggunakan SEA Catering",
      duration: 4000,
      action: {
        label: "Login Lagi",
        onClick: () => router.push(ROUTES.AUTH.LOGIN),
      },
    });
  };

  const requireAuth = (redirectTo: string = ROUTES.AUTH.LOGIN) => {
    if (!user || !authService.validateToken()) {
      notifications.warning({
        title: "Login diperlukan 🔐",
        description:
          "Silakan login terlebih dahulu untuk mengakses halaman ini",
        action: {
          label: "Login Sekarang",
          onClick: () => router.push(redirectTo),
        },
      });
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!user || user.role !== "admin" || !authService.validateToken()) {
      notifications.error({
        title: "Akses Ditolak 🚫",
        description: "Kamu tidak memiliki akses ke halaman admin.",
        action: {
          label: "Kembali",
          onClick: () =>
            router.push(user ? ROUTES.DASHBOARD.USER : ROUTES.HOME),
        },
      });
      router.push(user ? ROUTES.DASHBOARD.USER : ROUTES.HOME);
      return false;
    }
    return true;
  };

  // OTP operations with success notifications
  const sendOTP = async (
    email: string,
    type: "email_verification" | "password_reset"
  ) => {
    try {
      const response = await authService.sendOTP({ email, type });

      if (response.success) {
        notifications.success({
          title: "OTP berhasil dikirim! 📧",
          description: `Kode verifikasi telah dikirim ke ${email}`,
          duration: 5000,
        });
        return true;
      } else {
        notifications.error({
          title: "Gagal mengirim OTP",
          description: response.error || "Coba lagi dalam beberapa saat",
        });
        return false;
      }
    } catch (error) {
      notifications.networkError();
      return false;
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string,
    type: "email_verification" | "password_reset"
  ) => {
    try {
      const response = await authService.verifyOTP({ email, otp, type });

      if (response.success) {
        notifications.success({
          title: "OTP berhasil diverifikasi! ✅",
          description:
            type === "email_verification"
              ? "Email kamu sudah terverifikasi"
              : "OTP valid, silakan reset password",
          duration: 4000,
        });
        return true;
      } else {
        notifications.error({
          title: "OTP tidak valid",
          description: response.error || "Pastikan kode yang dimasukkan benar",
        });
        return false;
      }
    } catch (error) {
      notifications.networkError();
      return false;
    }
  };

  const forgotPassword = async (phone: string) => {
    try {
      const response = await authService.forgotPassword({ phone });

      if (response.success) {
        notifications.success({
          title: "Link reset password dikirim! 📱",
          description: `Instruksi reset password telah dikirim ke ${phone}`,
          duration: 5000,
        });
        return true;
      } else {
        notifications.error({
          title: "Gagal mengirim link reset",
          description: response.error || "Pastikan nomor HP terdaftar",
        });
        return false;
      }
    } catch (error) {
      notifications.networkError();
      return false;
    }
  };

  const resetPassword = async (
    phone: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      const response = await authService.resetPassword({
        phone,
        otp,
        new_password: newPassword,
      });

      if (response.success) {
        notifications.success({
          title: "Password berhasil direset! 🔐",
          description: "Silakan login dengan password baru kamu",
          duration: 5000,
        });
        router.push(ROUTES.AUTH.LOGIN);
        return true;
      } else {
        notifications.error({
          title: "Gagal reset password",
          description: response.error || "OTP mungkin sudah expired",
        });
        return false;
      }
    } catch (error) {
      notifications.networkError();
      return false;
    }
  };

  return {
    user,
    loading,
    login,
    adminLogin,
    register,
    logout,
    requireAuth,
    requireAdmin,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user && authService.validateToken(),
    isAdmin: user?.role === "admin",
  };
}
