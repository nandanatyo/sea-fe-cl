import { useState, useEffect } from "react";
import { adminService } from "@/lib/api/admin";
import { useToast } from "@/hooks/use-toast";
import { AdminMetrics } from "@/lib/types";

export function useAdmin() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMetrics = async (from: Date, to: Date) => {
    try {
      setLoading(true);
      const response = await adminService.getMetrics(
        from.toISOString(),
        to.toISOString()
      );

      if (response.success && response.data) {
        setMetrics(response.data);
      }
    } catch (error) {
      toast({
        title: "Gagal memuat data 😔",
        description: "Coba refresh halaman ya!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    fetchMetrics,
  };
}
