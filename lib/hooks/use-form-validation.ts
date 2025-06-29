// lib/hooks/use-form-validation.ts - Safe version
import { useState } from "react";
import { safelyExtractValidationErrors } from "@/lib/utils/validation-helpers";

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: any
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = async (): Promise<boolean> => {
    try {
      await validationSchema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error: any) {
      console.log("Validation error:", error);

      const fieldErrors: Partial<Record<keyof T, string>> = {};

      try {
        if (error?.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: any) => {
            if (err?.path && Array.isArray(err.path) && err.path.length > 0) {
              const fieldName = err.path[0] as keyof T;
              const message =
                typeof err.message === "string"
                  ? err.message
                  : `Validation error in ${String(fieldName)}`;
              fieldErrors[fieldName] = message;
            }
          });
        } else if (error?.message && typeof error.message === "string") {
          // If there's a general error message, apply it to the first field
          const firstField = Object.keys(values)[0] as keyof T;
          if (firstField) {
            fieldErrors[firstField] = error.message;
          }
        }
      } catch (processingError) {
        console.error("Error processing validation errors:", processingError);
        // Set a general error if we can't process the specific errors
        const firstField = Object.keys(values)[0] as keyof T;
        if (firstField) {
          fieldErrors[firstField] = "Validation error occurred";
        }
      }

      setErrors(fieldErrors);
      return false;
    }
  };

  const setValue = (name: keyof T, value: any) => {
    try {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } catch (error) {
      console.error(`Error setting value for field ${String(name)}:`, error);
    }
  };

  const setFieldError = (name: keyof T, message: string) => {
    try {
      setErrors((prev) => ({ ...prev, [name]: message }));
    } catch (error) {
      console.error(`Error setting field error for ${String(name)}:`, error);
    }
  };

  const clearFieldError = (name: keyof T) => {
    try {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      console.error(`Error clearing field error for ${String(name)}:`, error);
    }
  };

  const reset = () => {
    try {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error resetting form:", error);
    }
  };

  const getFieldError = (name: keyof T): string | undefined => {
    try {
      const error = errors[name];
      return typeof error === "string" ? error : undefined;
    } catch (error) {
      console.error(`Error getting field error for ${String(name)}:`, error);
      return undefined;
    }
  };

  const hasErrors = (): boolean => {
    try {
      return Object.keys(errors).length > 0;
    } catch (error) {
      console.error("Error checking if form has errors:", error);
      return false;
    }
  };

  const isFieldTouched = (name: keyof T): boolean => {
    try {
      return Boolean(touched[name]);
    } catch (error) {
      console.error(
        `Error checking if field ${String(name)} is touched:`,
        error
      );
      return false;
    }
  };

  return {
    values,
    errors,
    touched,
    setValue,
    validate,
    reset,
    setValues,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasErrors,
    isFieldTouched,
  };
}
