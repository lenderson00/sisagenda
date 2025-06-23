import { Prisma } from '@prisma/client'

const appointmentWithRelations = Prisma.validator<Prisma.AppointmentDefaultArgs>()({
  include: {
    deliveryType: true,
    user: true,
    activities: {
      include: {
        user: true,
      },
    },
  },
})

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<
  typeof appointmentWithRelations
>
