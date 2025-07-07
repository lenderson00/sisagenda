/**
 * Utility functions for image handling and validation
 */

/**
 * Check if an image URL is a blob URL (not uploaded yet)
 */
export function isBlobUrl(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("blob:"));
}

/**
 * Check if an image URL is a valid Bunny CDN URL
 */
export function isBunnyCdnUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes("b-cdn.net");
  } catch {
    return false;
  }
}

/**
 * Check if an image is uploaded to Bunny CDN
 */
export function isImageUploaded(url: string | null | undefined): boolean {
  return !isBlobUrl(url) && isBunnyCdnUrl(url);
}

/**
 * Validate image upload status and return error message if invalid
 */
export function validateImageUpload(url: string | null | undefined): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: "Image is required" };
  }

  if (isBlobUrl(url)) {
    return { isValid: false, error: "Image must be uploaded before form submission" };
  }

  if (!isBunnyCdnUrl(url)) {
    return { isValid: false, error: "Image must be uploaded to Bunny CDN" };
  }

  return { isValid: true };
}

/**
 * Generate a unique filename for uploaded images
 */
export function generateImageFilename(originalName: string, prefix = "image") {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Extract file extension from filename or URL
 */
export function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || 'jpg';
}

/**
 * Check if a file is a valid image type
 */
export function isValidImageType(file: File) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate image file size
 */
export function validateImageSize(file: File, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB (current: ${formatFileSize(file.size)})`
    };
  }

  return { isValid: true };
}
