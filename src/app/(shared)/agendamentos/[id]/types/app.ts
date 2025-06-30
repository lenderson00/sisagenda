import { Prisma } from "@prisma/client";

const appointmentWithRelations =
  Prisma.validator<Prisma.AppointmentDefaultArgs>()({
    include: {
      deliveryType: true,
      user: true,
      items: true,
      attachments: true,
      activities: {
        include: {
          user: true,
        },
      },
    },
  });

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<
  typeof appointmentWithRelations
>;

export type AppointmentWithRelationsAndStringPrice = Omit<
  AppointmentWithRelations,
  "items"
> & {
  items: (Omit<AppointmentWithRelations["items"][number], "price"> & {
    price: string;
  })[];
};
