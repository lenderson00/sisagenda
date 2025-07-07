"use client";

import { useCallback, useState } from "react";

interface UseImageUploadValidationProps {
  onValidationStart?: () => void;
  onValidationComplete?: (isValid: boolean) => void;
  onValidationError?: (error: string) => void;
}

export function useImageUploadValidation({
  onValidationStart,
  onValidationComplete,
  onValidationError,
}: UseImageUploadValidationProps = {}) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateImageUpload = useCallback(
    async (imageUrl: string | null | undefined): Promise<boolean> => {
      if (!imageUrl) {
        const error = "Image is required";
        setValidationErrors([error]);
        onValidationError?.(error);
        onValidationComplete?.(false);
        return false;
      }

      // Check if it's a blob URL (not uploaded yet)
      if (imageUrl.startsWith("blob:")) {
        const error = "Image must be uploaded before form submission";
        setValidationErrors([error]);
        onValidationError?.(error);
        onValidationComplete?.(false);
        return false;
      }

      // Check if it's a valid URL (should be a Bunny CDN URL)
      try {
        const url = new URL(imageUrl);
        if (!url.hostname.includes("b-cdn.net")) {
          const error = "Image must be uploaded to Bunny CDN";
          setValidationErrors([error]);
          onValidationError?.(error);
          onValidationComplete?.(false);
          return false;
        }
      } catch {
        const error = "Invalid image URL";
        setValidationErrors([error]);
        onValidationError?.(error);
        onValidationComplete?.(false);
        return false;
      }

      setValidationErrors([]);
      onValidationComplete?.(true);
      return true;
    },
    [onValidationComplete, onValidationError]
  );

  const validateFormWithImage = useCallback(
    async (
      imageUrl: string | null | undefined,
      formValidationFn?: () => Promise<boolean>
    ): Promise<boolean> => {
      setIsValidating(true);
      onValidationStart?.();

      try {
        // First validate the image
        const isImageValid = await validateImageUpload(imageUrl);
        if (!isImageValid) {
          return false;
        }

        // Then validate the rest of the form if provided
        if (formValidationFn) {
          const isFormValid = await formValidationFn();
          if (!isFormValid) {
            return false;
          }
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Validation failed";
        setValidationErrors([errorMessage]);
        onValidationError?.(errorMessage);
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [validateImageUpload, onValidationStart, onValidationError]
  );

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    isValidating,
    validationErrors,
    validateImageUpload,
    validateFormWithImage,
    clearValidationErrors,
  };
}
