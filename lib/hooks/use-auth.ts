// lib/hooks/use-auth.ts (Updated with enhanced notifications)
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
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(convertUserFromBackend(currentUser));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    const loadingToast = notifications.loading(
      "Sedang masuk...",
      "Memverifikasi kredensial kamu"
    );

    try {
      setLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data) {
        const convertedUser = convertUserFromBackend(response.data.user);
        setUser(convertedUser);

        // Dismiss loading toast and show success
        notifications.success({
          title: `Selamat datang kembali, ${
            convertedUser.fullName || convertedUser.name
          }! 🎉`,
          description: "Siap melanjutkan perjalanan hidup sehat?",
        });

        if (convertedUser.role === "admin") {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.DASHBOARD.USER);
        }
      } else {
        notifications.error({
          title: "Login gagal 😔",
          description: response.error || "Email/nomor HP atau password salah",
          action: {
            label: "Coba Lagi",
            onClick: () => {
              // Focus on email input if available
              const emailInput = document.querySelector(
                'input[type="email"]'
              ) as HTMLInputElement;
              if (emailInput) emailInput.focus();
            },
          },
        });
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
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (data: { email: string; password: string }) => {
    const loadingToast = notifications.loading(
      "Memverifikasi admin...",
      "Memeriksa kredensial admin"
    );

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
          description: "Dashboard admin siap digunakan",
        });

        router.push(ROUTES.DASHBOARD.ADMIN);
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
      }
    } catch (error) {
      notifications.serverError();
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    const loadingToast = notifications.loading(
      "Membuat akun...",
      "Menyiapkan akun baru untuk kamu"
    );

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
            title: "Selamat datang di keluarga SEA Catering! 🎉",
            description: "Akun berhasil dibuat. Mari mulai hidup sehat!",
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
            description: "Silakan login untuk melanjutkan",
          });

          router.push(ROUTES.AUTH.LOGIN);
        }
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
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeAuthToken();
    setUser(null);
    router.push(ROUTES.HOME);

    notifications.success({
      title: "Sampai jumpa! 👋",
      description:
        "Kamu berhasil logout. Terima kasih sudah menggunakan SEA Catering!",
      action: {
        label: "Login Lagi",
        onClick: () => router.push(ROUTES.AUTH.LOGIN),
      },
    });
  };

  const requireAuth = (redirectTo: string = ROUTES.AUTH.LOGIN) => {
    if (!user) {
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
    if (!user || user.role !== "admin") {
      notifications.error({
        title: "Akses Ditolak 🚫",
        description: "Kamu tidak memiliki akses ke halaman admin.",
        action: {
          label: "Kembali",
          onClick: () => router.push(ROUTES.DASHBOARD.USER),
        },
      });
      router.push(ROUTES.DASHBOARD.USER);
      return false;
    }
    return true;
  };

  const refreshToken = async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken(refreshToken);
      if (response.success && response.data) {
        const convertedUser = convertUserFromBackend(response.data.user);
        setUser(convertedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      notifications.warning({
        title: "Sesi berakhir ⏰",
        description: "Silakan login kembali untuk melanjutkan",
        action: {
          label: "Login",
          onClick: () => router.push(ROUTES.AUTH.LOGIN),
        },
      });
      logout();
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
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };
}
