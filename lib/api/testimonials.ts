// lib/api/testimonials.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { Testimonial, ApiResponse } from "@/lib/types";

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
      return await apiClient.post<Testimonial>(
        API_ENDPOINTS.TESTIMONIALS.BASE,
        data
      );
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
      return await apiClient.put<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.APPROVE(id)
      );
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
      return await apiClient.put<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.REJECT(id)
      );
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
      return await apiClient.delete<void>(
        API_ENDPOINTS.TESTIMONIALS.ADMIN.DELETE(id)
      );
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
};
