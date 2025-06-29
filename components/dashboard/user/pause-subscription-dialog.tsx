// components/dashboard/user/pause-subscription-dialog.tsx - Fixed version
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Calendar as CalendarIcon } from "lucide-react";

interface PauseSubscriptionDialogProps {
  subscriptionId: string;
  subscriptionName: string;
  onPause: (id: string, pauseUntil: Date) => Promise<boolean>;
  loading?: boolean;
}

// Helper function to format date for Indonesian locale
const formatDateID = (date: Date): string => {
  try {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Tanggal tidak valid";
  }
};

// Helper function to create safe date
const createSafeDate = (input?: Date | string | number): Date => {
  if (!input) {
    return new Date();
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? new Date() : input;
  }

  try {
    const date = new Date(input);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
};

export function PauseSubscriptionDialog({
  subscriptionId,
  subscriptionName,
  onPause,
  loading = false,
}: PauseSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pauseOption, setPauseOption] = useState<string>("7"); // Default 1 minggu
  const [customDate, setCustomDate] = useState<Date>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePause = async () => {
    try {
      setIsProcessing(true);

      let pauseUntilDate: Date;
      const now = new Date();

      if (pauseOption === "custom") {
        if (!customDate) {
          throw new Error("Pilih tanggal berakhir terlebih dahulu");
        }
        pauseUntilDate = new Date(customDate);
        // Set to end of selected day to ensure it's in the future
        pauseUntilDate.setHours(23, 59, 59, 999);
      } else {
        // Calculate pause end date based on selected days
        const days = parseInt(pauseOption);
        if (isNaN(days) || days <= 0) {
          throw new Error("Durasi jeda tidak valid");
        }

        // Ensure at least 24 hours from now
        pauseUntilDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      }

      // Validate the date
      if (!pauseUntilDate || isNaN(pauseUntilDate.getTime())) {
        throw new Error("Tanggal berakhir tidak valid");
      }

      if (pauseUntilDate <= now) {
        throw new Error("Tanggal berakhir harus setelah hari ini");
      }

      // Ensure minimum 24 hours difference
      const diffMs = pauseUntilDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24) {
        throw new Error("Durasi jeda minimal 24 jam dari sekarang");
      }

      const success = await onPause(subscriptionId, pauseUntilDate);

      if (success) {
        setOpen(false);
        // Reset form
        setPauseOption("7");
        setCustomDate(undefined);
      }
    } catch (error) {
      console.error("⏸️ Error in handlePause:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getResumeDate = (): string => {
    try {
      if (pauseOption === "custom" && customDate) {
        return formatDateID(createSafeDate(customDate));
      } else {
        const days = parseInt(pauseOption);
        if (isNaN(days)) return "Tanggal tidak valid";

        const resumeDate = new Date();
        resumeDate.setDate(resumeDate.getDate() + days);
        return formatDateID(resumeDate);
      }
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const pauseOptions = [
    { value: "1", label: "1 Hari" },
    { value: "3", label: "3 Hari" },
    { value: "7", label: "1 Minggu" },
    { value: "14", label: "2 Minggu" },
    { value: "30", label: "1 Bulan" },
    { value: "custom", label: "Pilih Tanggal" },
  ];

  const isFormValid = () => {
    if (pauseOption === "custom") {
      return customDate && !isNaN(createSafeDate(customDate).getTime());
    }
    return pauseOption && !isNaN(parseInt(pauseOption));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
          disabled={loading}>
          <Pause className="h-4 w-4 mr-2" />
          Jeda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pause className="h-5 w-5 text-orange-600" />
            Jeda Langganan
          </DialogTitle>
          <DialogDescription>
            Pilih berapa lama kamu ingin menjeda langganan{" "}
            <span className="font-semibold">{subscriptionName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="pauseOption">Durasi Jeda</Label>
            <Select value={pauseOption} onValueChange={setPauseOption}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Pilih durasi jeda" />
              </SelectTrigger>
              <SelectContent>
                {pauseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {pauseOption === "custom" && (
            <div>
              <Label>Pilih Tanggal Berakhir</Label>
              <div className="mt-2 border rounded-md p-3">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={(date) => {
                    console.log("📅 Calendar date selected:", date);
                    setCustomDate(date);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md"
                />
              </div>
              {customDate && (
                <div className="mt-2 text-sm text-gray-600">
                  Dipilih: {formatDateID(customDate)}
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              Informasi Jeda
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Mulai:</strong> {formatDateID(new Date())} (sekarang)
              </p>
              <p>
                <strong>Berakhir:</strong> {getResumeDate()}
              </p>
              <p className="text-xs mt-2 text-blue-600">
                💡 Langganan akan otomatis aktif kembali pada tanggal berakhir.
                Kamu juga bisa mengaktifkan lebih awal kapan saja.
              </p>
              <p className="text-xs text-blue-600">
                ⏰ Durasi minimum: 24 jam dari sekarang
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Perhatian:</strong> Selama dijeda, pengiriman makanan
              akan dihentikan sementara. Langganan akan otomatis aktif kembali
              pada tanggal yang dipilih.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isProcessing}>
            Batal
          </Button>
          <Button
            onClick={handlePause}
            disabled={isProcessing || !isFormValid()}
            className="bg-orange-600 hover:bg-orange-700">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memproses...
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Jeda Langganan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
