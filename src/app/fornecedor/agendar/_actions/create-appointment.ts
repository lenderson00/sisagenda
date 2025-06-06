'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createAppointmentInput = z.object({
  organizationId: z.string(),
  deliveryTypeId: z.string(),
  dateTime: z.date(),
  ordemDeCompra: z.string(),
  observations: z.record(z.any()),
})

export async function createAppointment(
  input: z.infer<typeof createAppointmentInput>,
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado.')
  }

  const validatedInput = createAppointmentInput.parse(input)

  const deliverySettings = await prisma.availabilitySettings.findUnique({
    where: {
      deliveryTypeId: validatedInput.deliveryTypeId,
    },
  })

  if (!deliverySettings) {
    throw new Error(
      'Configurações de agendamento não encontradas para este tipo de entrega.',
    )
  }

  const appointment = await prisma.appointment.create({
    data: {
      organizationId: validatedInput.organizationId,
      deliveryTypeId: validatedInput.deliveryTypeId,
      date: validatedInput.dateTime,
      duration: deliverySettings.duration,
      ordemDeCompra: validatedInput.ordemDeCompra,
      observations: validatedInput.observations,
      userId: session.user.id,
      status: 'PENDING_CONFIRMATION',
    },
  })

  revalidatePath('/fornecedor/agendamentos')
  revalidatePath('/admin/agendamentos')

  return appointment
}
