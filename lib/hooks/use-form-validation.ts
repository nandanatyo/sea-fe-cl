import { useState } from "react";

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
      const fieldErrors: Partial<Record<keyof T, string>> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0] as keyof T] = err.message;
          }
        });
      }

      setErrors(fieldErrors);
      return false;
    }
  };

  const setValue = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    validate,
    reset,
    setValues,
  };
}
