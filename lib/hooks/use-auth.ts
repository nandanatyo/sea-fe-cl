import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginData, type RegisterData } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants"; // Import ROUTES

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        // authService.setAuthToken(response.data.token); // Your authService doesn't return a token in the mock, so this line might cause an error if token is undefined.

        toast({
          title: `Selamat datang kembali, ${response.data.user.fullName}!`,
          description: "Siap melanjutkan perjalanan hidup sehat?",
        });

        if (response.data.user.role === "admin") {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.DASHBOARD.USER);
        }
      }
    } catch (error) {
      toast({
        title: "Login gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(data);

      if (response.success) {
        toast({
          title: "Selamat datang di keluarga SEA Catering!",
          description:
            "Akun berhasil dibuat. Silakan login untuk mulai hidup sehat!",
        });

        router.push(ROUTES.AUTH.LOGIN); // Use ROUTES.AUTH.LOGIN
      }
    } catch (error) {
      toast({
        title: "Registrasi gagal",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeAuthToken();
    setUser(null);
    router.push(ROUTES.HOME); // Use ROUTES.HOME

    toast({
      title: "Sampai jumpa!",
      description:
        "Kamu berhasil logout. Terima kasih sudah menggunakan SEA Catering!",
    });
  };

  const requireAuth = (redirectTo: string = ROUTES.AUTH.LOGIN) => {
    if (!user) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Akses Ditolak",
        description: "Kamu tidak memiliki akses ke halaman admin.",
        variant: "destructive",
      });
      router.push(ROUTES.DASHBOARD.USER);
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };
}
