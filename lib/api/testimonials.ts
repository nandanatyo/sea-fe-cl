// lib/api/testimonials.ts - Updated with success notifications
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { Testimonial, ApiResponse } from "@/lib/types";
import { notifications } from "@/lib/utils/notifications";

export interface CreateTestimonialData {
  customer_name: string;
  email: string;
  plan: string;
  location: string;
  message: string;
  rating: number;
}

export const testimonialService = {
  // Public endpoints
  async create(data: CreateTestimonialData): Promise<ApiResponse<Testimonial>> {
    try {
      const response = await apiClient.post<Testimonial>(
        API_ENDPOINTS.TESTIMONIALS.BASE,
        data
      );

      if (response.success) {
        notifications.operationSuccess.testimonialSubmitted();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create testimonial",
      };
    }
  },

  async getApproved(): Promise<ApiResponse<Testimonial[]>> {
    try {
      return await apiClient.get<Testimonial[]>(
        API_ENDPOINTS.TESTIMONIALS.BASE
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch testimonials",
      };
    }
  },

  // Admin endpoints
  async getAllAdmin(): Promise<ApiResponse<Testimonial[]>> {
    try {
      return await apiClient.get<Testimonial[]>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.ALL
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch all testimonials",
      };
    }
  },

  async approve(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.APPROVE(id)
      );

      if (response.success) {
        notifications.operationSuccess.testimonialApproved();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to approve testimonial",
      };
    }
  },

  async reject(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.REJECT(id)
      );

      if (response.success) {
        notifications.operationSuccess.testimonialRejected();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject testimonial",
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.DELETE(id)
      );

      if (response.success) {
        notifications.success({
          title: "Testimoni berhasil dihapus! 🗑️",
          description: "Testimoni telah dihapus dari sistem",
          duration: 4000,
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete testimonial",
      };
    }
  },

  // Bulk operations for admin
  async bulkApprove(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => this.approve(id))
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;

      const failed = ids.length - successful;

      if (successful > 0) {
        notifications.operationSuccess.bulkStatusUpdated(
          successful,
          "activated"
        );
      }

      if (failed > 0) {
        notifications.error({
          title: `${failed} testimoni gagal disetujui`,
          description: "Beberapa testimoni tidak dapat diproses",
        });
      }

      return {
        success: successful > 0,
        message: `${successful} testimoni berhasil disetujui${
          failed > 0 ? `, ${failed} gagal` : ""
        }`,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to bulk approve testimonials",
      };
    }
  },

  async bulkReject(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => this.reject(id))
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;

      const failed = ids.length - successful;

      if (successful > 0) {
        notifications.success({
          title: `${successful} testimoni berhasil ditolak! ✅`,
          description: "Testimoni telah ditolak dari review",
          duration: 4000,
        });
      }

      if (failed > 0) {
        notifications.error({
          title: `${failed} testimoni gagal ditolak`,
          description: "Beberapa testimoni tidak dapat diproses",
        });
      }

      return {
        success: successful > 0,
        message: `${successful} testimoni berhasil ditolak${
          failed > 0 ? `, ${failed} gagal` : ""
        }`,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to bulk reject testimonials",
      };
    }
  },
};
