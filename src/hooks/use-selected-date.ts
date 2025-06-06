// src/hooks/useScheduleStore.ts
import { create } from "zustand";

type ScheduleState = {
  date: Date | null;
  organizationId: string | null;
  deliveryTypeId: string | null;
  setDate: (date: Date) => void;
  setOrganizationId: (id: string) => void;
  setDeliveryTypeId: (id: string) => void;
  clearSchedule: () => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  date: null,
  organizationId: null,
  deliveryTypeId: null,

  setDate: (date) => set({ date }),
  setOrganizationId: (id) => set({ organizationId: id }),
  setDeliveryTypeId: (id) => set({ deliveryTypeId: id }),

  clearSchedule: () =>
    set({
      date: null,
      organizationId: null,
      deliveryTypeId: null,
    }),
}));
