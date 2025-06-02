import { z } from 'zod'
import { create } from 'zustand'

export const agendamentoSchema = z.object({
  organizacaoId: z.string(),
  deliveryTimeId: z.string(),
  data: z.date(),
  hora: z.string(),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  observacoes: z.string().optional(),
})

export type Agendamento = z.infer<typeof agendamentoSchema>

interface AgendamentoStore {
  currentStep: number
  agendamento: Partial<Agendamento>
  setStep: (step: number) => void
  updateAgendamento: (data: Partial<Agendamento>) => void
  resetAgendamento: () => void
}

export const useAgendamentoStore = create<AgendamentoStore>((set) => ({
  currentStep: 0,
  agendamento: {},
  setStep: (step) => set({ currentStep: step }),
  updateAgendamento: (data) =>
    set((state) => ({
      agendamento: { ...state.agendamento, ...data },
    })),
  resetAgendamento: () => set({ agendamento: {}, currentStep: 0 }),
}))
