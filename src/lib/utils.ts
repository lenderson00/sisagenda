import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleanedCNPJ = cnpj.replace(/[^\d]/g, "");

  // Check if CNPJ has 14 digits
  if (cleanedCNPJ.length !== 14) {
    return false;
  }

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validate first digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cleanedCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(cleanedCNPJ.charAt(12))) {
    return false;
  }

  // Validate second digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(cleanedCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(cleanedCNPJ.charAt(13))) {
    return false;
  }

  return true;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
