import { Prisma } from "@prisma/client";

const appointmentWithRelations =
  Prisma.validator<Prisma.AppointmentDefaultArgs>()({
    include: {
      deliveryType: true,
      User: true,
      Supplier: true,
      items: true,
      attachments: true,
      activities: {
        include: {
          user: true,
          supplier: true,
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
  creator:
  | AppointmentWithRelations["User"]
  | AppointmentWithRelations["Supplier"];
};
