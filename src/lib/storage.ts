import type { DetailsFormValues } from "@/app/fornecedor/agendar/(steps)/[omslug]/[deliveryslug]/informacoes/_components/details-form";

const STORAGE_KEY_PREFIX = "appointment_form_";

export function getStorageKey(orgSlug: string, deliverySlug: string) {
  return `${STORAGE_KEY_PREFIX}${orgSlug}_${deliverySlug}`;
}

export function saveFormData(orgSlug: string, deliverySlug: string, data: DetailsFormValues) {
  const key = getStorageKey(orgSlug, deliverySlug);
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFormData(orgSlug: string, deliverySlug: string): DetailsFormValues | null {
  const key = getStorageKey(orgSlug, deliverySlug);
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data);
}

export function clearFormData(orgSlug: string, deliverySlug: string) {
  const key = getStorageKey(orgSlug, deliverySlug);
  localStorage.removeItem(key);
}
