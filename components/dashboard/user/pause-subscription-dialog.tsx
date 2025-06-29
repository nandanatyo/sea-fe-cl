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
import { formatDateID } from "@/lib/utils/date";

interface PauseSubscriptionDialogProps {
  subscriptionId: string;
  subscriptionName: string;
  onPause: (id: string, pauseUntil: Date) => Promise<boolean>;
  loading?: boolean;
}

export function PauseSubscriptionDialog({
  subscriptionId,
  subscriptionName,
  onPause,
  loading = false,
}: PauseSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pauseOption, setPauseOption] = useState<string>("30"); // Default 30 days
  const [customDate, setCustomDate] = useState<Date>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePause = async () => {
    try {
      setIsProcessing(true);

      let pauseUntilDate: Date;

      if (pauseOption === "custom" && customDate) {
        pauseUntilDate = customDate;
      } else {
        // Calculate pause end date based on selected days
        const days = parseInt(pauseOption);
        pauseUntilDate = new Date();
        pauseUntilDate.setDate(pauseUntilDate.getDate() + days);
      }

      // Ensure the pause date is set to end of day for better UX
      pauseUntilDate.setHours(23, 59, 59, 999);

      const success = await onPause(subscriptionId, pauseUntilDate);

      if (success) {
        setOpen(false);
        // Reset form
        setPauseOption("30");
        setCustomDate(undefined);
      }
    } catch (error) {
      console.error("Error pausing subscription:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getResumeDate = (): string => {
    if (pauseOption === "custom" && customDate) {
      return formatDateID(customDate);
    } else {
      const days = parseInt(pauseOption);
      const resumeDate = new Date();
      resumeDate.setDate(resumeDate.getDate() + days);
      return formatDateID(resumeDate);
    }
  };

  const pauseOptions = [
    { value: "7", label: "1 Minggu" },
    { value: "14", label: "2 Minggu" },
    { value: "30", label: "1 Bulan" },
    { value: "60", label: "2 Bulan" },
    { value: "90", label: "3 Bulan" },
    { value: "custom", label: "Pilih Tanggal" },
  ];

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
                  onSelect={setCustomDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              Informasi Jeda
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Mulai:</strong> {formatDateID(new Date())} (hari ini)
              </p>
              <p>
                <strong>Berakhir:</strong> {getResumeDate()}
              </p>
              <p className="text-xs mt-2 text-blue-600">
                💡 Langganan akan otomatis aktif kembali pada tanggal berakhir.
                Kamu juga bisa mengaktifkan lebih awal kapan saja.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Perhatian:</strong> Selama dijeda, pengiriman makanan
              akan dihentikan sementara. Billing cycle tetap berjalan sesuai
              tanggal berakhir jeda.
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
            disabled={
              isProcessing ||
              (pauseOption === "custom" && !customDate) ||
              !pauseOption
            }
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
