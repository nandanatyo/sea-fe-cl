// lib/hooks/use-auth.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginData, type RegisterData } from "@/lib/api/auth";
import { adminService } from "@/lib/api/admin";
import { useToast } from "@/hooks/use-toast";
import { User, convertUserFromBackend } from "@/lib/types";
import { ROUTES } from "@/lib/constants";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(convertUserFromBackend(currentUser));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data) {
        const convertedUser = convertUserFromBackend(response.data.user);
        setUser(convertedUser);

        toast({
          title: `Selamat datang kembali, ${
            convertedUser.fullName || convertedUser.name
          }!`,
          description: "Siap melanjutkan perjalanan hidup sehat?",
        });

        if (convertedUser.role === "admin") {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.DASHBOARD.USER);
        }
      } else {
        toast({
          title: "Login gagal 😔",
          description: response.error || "Email/nomor HP atau password salah",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
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

        toast({
          title: `Selamat datang, Admin ${
            convertedUser.fullName || convertedUser.name
          }!`,
          description: "Dashboard admin siap digunakan",
        });

        router.push(ROUTES.DASHBOARD.ADMIN);
      } else {
        toast({
          title: "Login admin gagal 😔",
          description: response.error || "Email atau password salah",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login admin gagal",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      // Convert frontend data to backend format
      const backendData: RegisterData = {
        name: data.fullName, // Convert fullName to name
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

          toast({
            title: "Selamat datang di keluarga SEA Catering! 🎉",
            description: "Akun berhasil dibuat. Selamat datang!",
          });

          router.push(ROUTES.DASHBOARD.USER);
        } else {
          toast({
            title: "Registrasi berhasil! 🎉",
            description: "Silakan login untuk melanjutkan",
          });

          router.push(ROUTES.AUTH.LOGIN);
        }
      } else {
        toast({
          title: "Registrasi gagal 😔",
          description: response.error || "Terjadi kesalahan saat membuat akun",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan pada server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeAuthToken();
    setUser(null);
    router.push(ROUTES.HOME);

    toast({
      title: "Sampai jumpa! 👋",
      description:
        "Kamu berhasil logout. Terima kasih sudah menggunakan SEA Catering!",
    });
  };

  const requireAuth = (redirectTo: string = ROUTES.AUTH.LOGIN) => {
    if (!user) {
      toast({
        title: "Login diperlukan 🔐",
        description:
          "Silakan login terlebih dahulu untuk mengakses halaman ini",
        variant: "destructive",
      });
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Akses Ditolak 🚫",
        description: "Kamu tidak memiliki akses ke halaman admin.",
        variant: "destructive",
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
