// lib/hooks/use-auth.ts - Fixed admin login management
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type LoginData, type RegisterData } from "@/lib/api/auth";
import { adminService } from "@/lib/api/admin";
import { userService, type UpdateProfileData } from "@/lib/api/user";
import { notifications } from "@/lib/utils/notifications";
import {
  User,
  convertUserFromBackend,
  type RegisterFormData,
} from "@/lib/types";
import { ROUTES } from "@/lib/constants";

// Query keys for TanStack Query
export const authQueryKeys = {
  currentUser: ["auth", "currentUser"] as const,
  profile: ["auth", "profile"] as const,
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query to get current user
  const {
    data: user,
    isLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: async (): Promise<User | null> => {
      // Check if we have valid token and user data
      if (!authService.validateToken()) {
        authService.removeAuthToken();
        return null;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        authService.removeAuthToken();
        return null;
      }

      return convertUserFromBackend(currentUser);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Login mutation (regular user)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await authService.login(data);

      if (!response.success) {
        throw new Error(response.error || "Login failed");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        const convertedUser = convertUserFromBackend(data.user);

        // Update the query cache with new user data
        queryClient.setQueryData(authQueryKeys.currentUser, convertedUser);

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
        const targetRoute =
          convertedUser.role === "admin"
            ? ROUTES.DASHBOARD.ADMIN
            : ROUTES.DASHBOARD.USER;

        router.push(targetRoute);
      }
    },
    onError: (error: Error) => {
      notifications.error({
        title: "Login gagal 😔",
        description: error.message || "Email/nomor HP atau password salah",
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
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Convert frontend data to backend format
      const backendData: RegisterData = {
        name: data.fullName,
        phone: data.phone,
        password: data.password,
        email: data.email,
      };

      const response = await authService.register(backendData);

      if (!response.success) {
        throw new Error(response.error || "Registration failed");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        // Auto login after successful registration
        const convertedUser = convertUserFromBackend(data.user);

        // Update the query cache with new user data
        queryClient.setQueryData(authQueryKeys.currentUser, convertedUser);

        notifications.success({
          title: "Akun berhasil dibuat! 🎉",
          description:
            "Selamat datang di keluarga SEA Catering! Mari mulai hidup sehat!",
          duration: 6000,
          action: {
            label: "Mulai Tour",
            onClick: () => {
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
    },
    onError: (error: Error) => {
      const errorMessage = error.message;

      // Handle specific registration errors
      if (errorMessage.includes("email") && errorMessage.includes("sudah")) {
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
        errorMessage.includes("phone") &&
        errorMessage.includes("sudah")
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
          description: errorMessage || "Terjadi kesalahan saat membuat akun",
        });
      }
    },
  });

  // Admin login mutation - Fixed to properly handle auth state
  const adminLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log("🔐 Starting admin login mutation...");

      const response = await adminService.login(data);

      console.log("🔐 Admin service response:", response);

      if (!response.success) {
        throw new Error(response.error || "Admin login failed");
      }

      if (!response.data) {
        throw new Error("No data received from admin login");
      }

      return response.data;
    },
    onSuccess: (data) => {
      console.log("🔐 Admin login mutation success:", data);

      try {
        if (!data) {
          throw new Error("No data received");
        }

        if (!data.user) {
          throw new Error(
            `No user object in response. Received keys: ${Object.keys(data)}`
          );
        }

        if (!data.user.id) {
          throw new Error("User object missing required 'id' field");
        }

        if (!data.user.email) {
          throw new Error("User object missing required 'email' field");
        }

        if (!data.user.role) {
          throw new Error("User object missing required 'role' field");
        }

        if (!data.access_token) {
          throw new Error("No access token in response");
        }

        // Verify user is admin
        if (data.user.role !== "admin") {
          throw new Error(`User role is '${data.user.role}', not 'admin'`);
        }

        console.log("🔐 All validation passed, storing auth data...");

        // Store authentication data using authService methods
        authService.setAuthToken(data.access_token);
        authService.setCurrentUser(data.user);

        const convertedUser = convertUserFromBackend(data.user);

        // Update the query cache with new admin user data
        queryClient.setQueryData(authQueryKeys.currentUser, convertedUser);

        console.log("🔐 Admin auth data stored successfully:", {
          user: convertedUser,
          tokenLength: data.access_token.length,
        });

        notifications.success({
          title: `Selamat datang, Admin ${
            convertedUser.fullName || convertedUser.name
          }! 👑`,
          description: "Login admin berhasil! Dashboard siap digunakan",
          duration: 5000,
        });

        // Navigate to admin dashboard
        router.push(ROUTES.DASHBOARD.ADMIN);
      } catch (processingError) {
        console.error(
          "🔐 Error processing admin login success:",
          processingError
        );
        throw processingError;
      }
    },
    onError: (error: Error) => {
      console.error("🔐 Admin login mutation error:", error);

      // More specific error messages
      let errorDescription = "Email atau password admin salah";

      if (error.message.includes("role")) {
        errorDescription =
          "Akun ini bukan admin. Gunakan akun admin yang valid.";
      } else if (error.message.includes("token")) {
        errorDescription = "Server tidak mengembalikan token akses yang valid.";
      } else if (error.message.includes("user")) {
        errorDescription = "Data user tidak valid dalam response server.";
      } else if (error.message.includes("undefined")) {
        errorDescription = "Response server tidak lengkap. Coba lagi.";
      }

      notifications.error({
        title: "Login admin gagal 🚫",
        description: errorDescription,
        action: {
          label: "Hubungi IT",
          onClick: () => {
            window.open(
              "mailto:it@seacatering.id?subject=Admin Login Issue&body=" +
                encodeURIComponent(`Error: ${error.message}`),
              "_blank"
            );
          },
        },
      });
    },
  });

  // Logout function
  const logout = () => {
    authService.removeAuthToken();

    // Clear all queries related to authenticated user
    queryClient.setQueryData(authQueryKeys.currentUser, null);
    queryClient.clear(); // Clear all cached data

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

  // Auth guards
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
    console.log("🔍 Checking admin access:", {
      hasUser: !!user,
      userRole: user?.role,
      tokenValid: authService.validateToken(),
    });

    if (!user || user.role !== "admin" || !authService.validateToken()) {
      console.log("❌ Admin access denied");

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

    console.log("✅ Admin access granted");
    return true;
  };

  // OTP operations
  const sendOTPMutation = useMutation({
    mutationFn: async ({
      email,
      type,
    }: {
      email: string;
      type: "email_verification" | "password_reset";
    }) => {
      const response = await authService.sendOTP({ email, type });
      if (!response.success) {
        throw new Error(response.error || "Failed to send OTP");
      }
      return response;
    },
    onSuccess: (_, variables) => {
      notifications.success({
        title: "OTP berhasil dikirim! 📧",
        description: `Kode verifikasi telah dikirim ke ${variables.email}`,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      notifications.error({
        title: "Gagal mengirim OTP",
        description: error.message || "Coba lagi dalam beberapa saat",
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async ({
      email,
      otp,
      type,
    }: {
      email: string;
      otp: string;
      type: "email_verification" | "password_reset";
    }) => {
      const response = await authService.verifyOTP({ email, otp, type });
      if (!response.success) {
        throw new Error(response.error || "OTP verification failed");
      }
      return response;
    },
    onSuccess: (_, variables) => {
      notifications.success({
        title: "OTP berhasil diverifikasi! ✅",
        description:
          variables.type === "email_verification"
            ? "Email kamu sudah terverifikasi"
            : "OTP valid, silakan reset password",
        duration: 4000,
      });
    },
    onError: (error: Error) => {
      notifications.error({
        title: "OTP tidak valid",
        description: error.message || "Pastikan kode yang dimasukkan benar",
      });
    },
  });

  return {
    // User data
    user,
    isLoading,
    userError,

    // Computed properties
    isAuthenticated: !!user && authService.validateToken(),
    isAdmin: user?.role === "admin",

    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    adminLogin: adminLoginMutation.mutate,
    sendOTP: sendOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isAdminLoginLoading: adminLoginMutation.isPending,
    isSendOTPLoading: sendOTPMutation.isPending,
    isVerifyOTPLoading: verifyOTPMutation.isPending,

    // Functions
    logout,
    requireAuth,
    requireAdmin,
    refetchUser,

    // Reset mutations
    resetLoginMutation: loginMutation.reset,
    resetRegisterMutation: registerMutation.reset,
  };
}

// Separate hook for profile management
export function useProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: async () => {
      const response = await userService.getProfile();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!authService.getAccessToken(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await userService.updateProfile(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update profile");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update both profile and current user queries
      queryClient.setQueryData(authQueryKeys.profile, data);
      queryClient.setQueryData(authQueryKeys.currentUser, data);

      notifications.operationSuccess.profileUpdated();
    },
    onError: (error: Error) => {
      notifications.error({
        title: "Gagal memperbarui profil",
        description: error.message,
      });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
