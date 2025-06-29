// lib/utils/date.ts - Date utilities for backend compatibility

/**
 * Converts a Date object or date string to ISO string format for backend
 * Backend expects format: "2024-02-01T00:00:00Z"
 */
export const toBackendDateString = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date provided");
    }

    return dateObj.toISOString();
  } catch (error) {
    console.error("Error converting date to backend format:", error);
    throw new Error("Invalid date format");
  }
};

/**
 * Creates a date range for subscription pause
 * @param startDate - Start date (default: now)
 * @param durationDays - Duration in days (default: 30)
 */
export const createPauseDateRange = (
  startDate?: Date,
  durationDays: number = 30
): { start_date: string; end_date: string } => {
  const start = startDate || new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);

  return {
    start_date: toBackendDateString(start),
    end_date: toBackendDateString(end),
  };
};

/**
 * Validates date range for subscription pause
 */
export const validatePauseDateRange = (
  startDate: string | Date,
  endDate: string | Date
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      errors.push("Start date is invalid");
    }

    if (isNaN(end.getTime())) {
      errors.push("End date is invalid");
    }

    if (errors.length === 0) {
      if (end <= start) {
        errors.push("End date must be after start date");
      }

      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 1) {
        errors.push("Pause duration must be at least 1 day");
      }

      if (diffDays > 365) {
        errors.push("Pause duration cannot exceed 1 year");
      }
    }
  } catch (error) {
    errors.push("Error validating dates");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Formats date for Indonesian locale display
 */
export const formatDateID = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Calculates the number of days between two dates
 */
export const daysBetween = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
