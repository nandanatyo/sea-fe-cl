import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { AdminMetrics, ApiResponse } from "@/lib/types";

export const adminService = {
  async getMetrics(
    from: string,
    to: string
  ): Promise<ApiResponse<AdminMetrics>> {
    return apiClient.get<AdminMetrics>(
      `${API_ENDPOINTS.ADMIN.METRICS}?from=${from}&to=${to}`
    );
  },
};
