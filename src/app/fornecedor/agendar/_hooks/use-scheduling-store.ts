import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SchedulingState = {
  organizationId: string | null
  deliveryTypeId: string | null
  selectedDate: Date | null
  selectedTime: string | null
  ordemDeCompra: string | null
  observations: Record<string, any> | null
}

type SchedulingActions = {
  setOrganization: (id: string) => void
  setDeliveryType: (id: string) => void
  setSelectedDate: (date: Date) => void
  setSelectedTime: (time: string) => void
  setOrdemDeCompra: (oc: string) => void
  setObservations: (obs: Record<string, any>) => void
  reset: () => void
}

const initialState: SchedulingState = {
  organizationId: null,
  deliveryTypeId: null,
  selectedDate: null,
  selectedTime: null,
  ordemDeCompra: null,
  observations: null,
}

export const useSchedulingStore = create(
  persist<SchedulingState & SchedulingActions>(
    (set) => ({
      ...initialState,
      setOrganization: (id) => set({ organizationId: id }),
      setDeliveryType: (id) => set({ deliveryTypeId: id }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setOrdemDeCompra: (oc) => set({ ordemDeCompra: oc }),
      setObservations: (obs) => set({ observations: obs }),
      reset: () => set(initialState),
    }),
    {
      name: 'scheduling-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
