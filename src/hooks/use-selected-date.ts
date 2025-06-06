// src/hooks/useDataStore.ts
import { create } from "zustand";

type DateStore = {
  data: Date | null;
  setDate: (newDate: Date) => void;
  clearDate: () => void;
};

export const useDateStore = create<DateStore>((set) => ({
  data: null,
  setDate: (newDate) => set({ data: newDate }),
  clearDate: () => set({ data: null }),
}));
