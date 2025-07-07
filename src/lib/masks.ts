/**
 * Utility functions for input masks
 */

/**
 * Applies NIP mask format: XX.XXXX.XX
 * @param value - The input value to mask
 * @returns The masked value
 */
export function applyNipMask(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Apply mask: XX.XXXX.XX
  if (digits.length <= 2) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 6)}.${digits.slice(6, 8)}`
}

/**
 * Removes mask from NIP value
 * @param value - The masked value
 * @returns The unmasked value (digits only)
 */
export function removeNipMask(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Validates if a NIP value has the correct format
 * @param value - The NIP value to validate
 * @returns True if valid, false otherwise
 */
export function isValidNip(value: string): boolean {
  const digits = removeNipMask(value)
  return digits.length === 8
}
