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
};
