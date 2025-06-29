// lib/utils/validation-helpers.ts - Safe validation utilities
export const safelyExtractValidationErrors = (error: any): string[] => {
  const errors: string[] = [];

  try {
    if (typeof error === "string") {
      errors.push(error);
    } else if (error?.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        if (typeof err === "string") {
          errors.push(err);
        } else if (err?.message && typeof err.message === "string") {
          errors.push(err.message);
        } else if (err?.path && err.path.length > 0) {
          const fieldName = Array.isArray(err.path) ? err.path[0] : err.path;
          const message = err.message || `Validation error in ${fieldName}`;
          errors.push(
            typeof message === "string"
              ? message
              : `Error in field: ${fieldName}`
          );
        }
      });
    } else if (error?.message && typeof error.message === "string") {
      errors.push(error.message);
    } else if (error && typeof error === "object") {
      // Try to extract meaningful validation errors from object
      Object.keys(error).forEach((key) => {
        const value = error[key];
        if (typeof value === "string") {
          errors.push(`${key}: ${value}`);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "string") {
              errors.push(`${key}[${index}]: ${item}`);
            }
          });
        }
      });
    }

    if (errors.length === 0) {
      errors.push("Validation error occurred");
    }
  } catch (e) {
    console.error("Error extracting validation errors:", e);
    errors.push("Validation error occurred");
  }

  return errors;
};

export const safeValidationErrorMessage = (error: any): string => {
  const errors = safelyExtractValidationErrors(error);
  return errors.join(", ");
};

// Helper to safely handle form submission errors
export const handleFormSubmissionError = (error: any): string => {
  if (typeof error === "string") return error;

  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  if (error?.error && typeof error.error === "string") {
    return error.error;
  }

  if (error?.errors && Array.isArray(error.errors)) {
    const messages = error.errors
      .map((e: any) => (typeof e === "string" ? e : e?.message || "Error"))
      .filter(Boolean);
    return messages.length > 0 ? messages.join(", ") : "Form submission failed";
  }

  return "Form submission failed";
};

// Safe field error extraction for React Hook Form
export const extractFieldError = (
  fieldErrors: any,
  fieldName: string
): string | undefined => {
  try {
    const fieldError = fieldErrors?.[fieldName];

    if (typeof fieldError === "string") {
      return fieldError;
    }

    if (fieldError?.message && typeof fieldError.message === "string") {
      return fieldError.message;
    }

    if (fieldError?.type && typeof fieldError.type === "string") {
      // Map common validation types to user-friendly messages
      const typeMessages: Record<string, string> = {
        required: "Field ini wajib diisi",
        pattern: "Format tidak valid",
        minLength: "Terlalu pendek",
        maxLength: "Terlalu panjang",
        min: "Nilai terlalu kecil",
        max: "Nilai terlalu besar",
        email: "Format email tidak valid",
      };

      return (
        typeMessages[fieldError.type] || `Validation error: ${fieldError.type}`
      );
    }

    return undefined;
  } catch (e) {
    console.error(`Error extracting field error for ${fieldName}:`, e);
    return undefined;
  }
};

// Safe error rendering component helper
export const SafeErrorDisplay: React.FC<{ error: any; fallback?: string }> = ({
  error,
  fallback = "An error occurred",
}) => {
  try {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || error?.error || fallback;

    return (
      <span>{typeof errorMessage === "string" ? errorMessage : fallback}</span>
    );
  } catch (e) {
    console.error("Error rendering error message:", e);
    return <span>{fallback}</span>;
  }
};
