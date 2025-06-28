// lib/utils/notifications.ts - Enhanced with more success notification patterns
import { toast } from "sonner";

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notifications = {
  success: (options: NotificationOptions) => {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  error: (options: NotificationOptions) => {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 6000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  warning: (options: NotificationOptions) => {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  info: (options: NotificationOptions) => {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  loading: (title: string, description?: string) => {
    return toast.loading(title, {
      description,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, options);
  },

  // Predefined success notifications for common operations
  operationSuccess: {
    // Profile operations
    profileUpdated: () => {
      toast.success("Profil berhasil diperbarui! ✅", {
        description: "Perubahan sudah disimpan di akun kamu",
        duration: 4000,
      });
    },

    passwordChanged: () => {
      toast.success("Password berhasil diubah! 🔐", {
        description: "Password baru sudah aktif untuk login berikutnya",
        duration: 5000,
      });
    },

    profileImageUploaded: () => {
      toast.success("Foto profil berhasil diunggah! 📸", {
        description: "Foto profil baru sudah tampil di akun kamu",
        duration: 4000,
      });
    },

    // Subscription operations
    subscriptionCreated: (planName: string) => {
      toast.success("Langganan berhasil dibuat! 🎉", {
        description: `${planName} sudah aktif. Tim kami akan segera menghubungi kamu`,
        duration: 6000,
        action: {
          label: "Lihat Detail",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    },

    subscriptionPaused: (resumeDate?: string) => {
      toast.success("Langganan berhasil dijeda! ⏸️", {
        description: resumeDate
          ? `Akan otomatis aktif lagi pada ${resumeDate}`
          : "Kamu bisa mengaktifkan lagi kapan saja",
        duration: 5000,
        action: {
          label: "Kelola Langganan",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    },

    subscriptionResumed: () => {
      toast.success("Langganan aktif kembali! 🎉", {
        description: "Pengiriman akan dimulai pada jadwal berikutnya",
        duration: 5000,
        action: {
          label: "Lihat Jadwal",
          onClick: () => (window.location.href = "/dashboard"),
        },
      });
    },

    subscriptionCancelled: () => {
      toast.warning("Langganan berhasil dibatalkan 😢", {
        description: "Kami sedih kamu pergi. Semoga bisa kembali lagi!",
        duration: 6000,
        action: {
          label: "Buat Langganan Baru",
          onClick: () => (window.location.href = "/subscription"),
        },
      });
    },

    subscriptionUpdated: () => {
      toast.success("Langganan berhasil diperbarui! ✅", {
        description: "Perubahan akan berlaku pada pengiriman berikutnya",
        duration: 4000,
      });
    },

    // Testimonial operations
    testimonialSubmitted: () => {
      toast.success("Testimoni berhasil dikirim! 🙏", {
        description:
          "Terima kasih! Testimoni akan ditampilkan setelah disetujui",
        duration: 5000,
        action: {
          label: "Lihat Testimoni Lain",
          onClick: () => (window.location.href = "/testimonial"),
        },
      });
    },

    testimonialApproved: () => {
      toast.success("Testimoni berhasil disetujui! ✅", {
        description: "Testimoni sekarang ditampilkan di halaman utama",
        duration: 4000,
      });
    },

    testimonialRejected: () => {
      toast.info("Testimoni ditolak 📝", {
        description: "Testimoni tidak memenuhi kriteria untuk ditampilkan",
        duration: 4000,
      });
    },

    // Admin operations
    userStatusUpdated: (action: "activated" | "deactivated") => {
      toast.success(
        `User berhasil ${
          action === "activated" ? "diaktifkan" : "dinonaktifkan"
        }! ✅`,
        {
          description: `Status user telah diperbarui`,
          duration: 4000,
        }
      );
    },

    mealPlanCreated: (planName: string) => {
      toast.success("Paket makanan berhasil dibuat! 🍽️", {
        description: `${planName} sudah tersedia untuk pelanggan`,
        duration: 5000,
      });
    },

    mealPlanUpdated: (planName: string) => {
      toast.success("Paket makanan berhasil diperbarui! ✅", {
        description: `Perubahan pada ${planName} sudah disimpan`,
        duration: 4000,
      });
    },

    bulkStatusUpdated: (count: number, status: "activated" | "deactivated") => {
      toast.success(
        `${count} item berhasil ${
          status === "activated" ? "diaktifkan" : "dinonaktifkan"
        }! ✅`,
        {
          description: "Perubahan status sudah diterapkan",
          duration: 4000,
        }
      );
    },

    // Contact operations
    messageSubmitted: () => {
      toast.success("Pesan berhasil dikirim! 📧", {
        description: "Tim kami akan membalas dalam 1x24 jam",
        duration: 5000,
      });
    },

    // Data operations
    dataExported: (type: string) => {
      toast.success("Data berhasil diekspor! 📊", {
        description: `File ${type} siap diunduh`,
        duration: 4000,
      });
    },

    dataImported: (count: number) => {
      toast.success("Data berhasil diimpor! 📥", {
        description: `${count} item berhasil ditambahkan`,
        duration: 4000,
      });
    },

    // System operations
    cacheCleared: () => {
      toast.success("Cache berhasil dibersihkan! 🧹", {
        description: "Sistem akan memuat data terbaru",
        duration: 3000,
      });
    },

    settingsUpdated: () => {
      toast.success("Pengaturan berhasil disimpan! ⚙️", {
        description: "Perubahan pengaturan sudah diterapkan",
        duration: 4000,
      });
    },
  },

  // Predefined error notifications for common scenarios
  networkError: () => {
    toast.error("Koneksi bermasalah 🌐", {
      description: "Periksa koneksi internet kamu dan coba lagi",
      action: {
        label: "Coba Lagi",
        onClick: () => window.location.reload(),
      },
    });
  },

  serverError: () => {
    toast.error("Server sedang bermasalah 🔧", {
      description:
        "Tim kami sedang memperbaiki masalah ini. Coba lagi dalam beberapa menit.",
      action: {
        label: "Refresh",
        onClick: () => window.location.reload(),
      },
    });
  },

  unauthorized: () => {
    toast.error("Sesi berakhir 🔐", {
      description: "Silakan login kembali untuk melanjutkan",
      action: {
        label: "Login",
        onClick: () => (window.location.href = "/login"),
      },
    });
  },

  validationError: (message?: string) => {
    toast.error("Data tidak valid ❌", {
      description: message || "Periksa kembali data yang kamu masukkan",
    });
  },

  permissionDenied: () => {
    toast.error("Akses ditolak 🚫", {
      description: "Kamu tidak memiliki izin untuk melakukan aksi ini",
    });
  },

  quotaExceeded: () => {
    toast.warning("Batas tercapai ⚠️", {
      description:
        "Kamu telah mencapai batas maksimal. Upgrade akun untuk melanjutkan.",
    });
  },

  maintenanceMode: () => {
    toast.info("Mode pemeliharaan 🔧", {
      description: "Sistem sedang dalam pemeliharaan. Mohon bersabar ya!",
    });
  },

  // Welcome and onboarding notifications
  welcome: {
    firstTime: (name: string) => {
      toast.success(`Selamat datang di SEA Catering, ${name}! 🎉`, {
        description: "Mari mulai perjalanan hidup sehat kamu!",
        duration: 6000,
        action: {
          label: "Mulai Tour",
          onClick: () => {
            // Trigger onboarding tour
            console.log("Start onboarding");
          },
        },
      });
    },

    returningUser: (name: string) => {
      toast.success(`Selamat datang kembali, ${name}! 👋`, {
        description: "Siap melanjutkan perjalanan hidup sehat?",
        duration: 4000,
      });
    },

    adminAccess: (name: string) => {
      toast.success(`Selamat datang, Admin ${name}! 👑`, {
        description: "Dashboard admin siap digunakan",
        duration: 5000,
      });
    },
  },
};
