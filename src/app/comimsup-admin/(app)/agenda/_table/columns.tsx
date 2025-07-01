import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import {
  IconBuilding,
  IconCalendar,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  user: User;
  organization: Organization;
};

const dtf = createColumnConfigHelper<AppointmentWithRelations>();

export const columnsConfig = [
  // Status Column
  dtf
    .option()
    .id("status")
    .displayName("Status")
    .icon(IconCalendar)
    .accessor((row) => row.status)
    .options([
      {
        label: "Pendente de Confirmação",
        value: "PENDING_CONFIRMATION",
      },
      {
        label: "Confirmado",
        value: "CONFIRMED",
      },
      {
        label: "Cancelado",
        value: "CANCELLED",
      },
      {
        label: "Concluído",
        value: "COMPLETED",
      },
    ])
    .build(),

  // Date Column
  dtf
    .date()
    .id("date")
    .displayName("Data de Agendamento")
    .icon(IconCalendar)
    .accessor((row) => new Date(row.date))
    .build(),

  // Organization Column
  dtf
    .option()
    .id("organization")
    .displayName("Organização Militar")
    .icon(IconBuilding)
    .accessor((row) => row.organization.name)
    .transformOptionFn((value) => ({
      label: value,
      value: value,
    }))
    .build(),

  // Supplier Column
  dtf
    .option()
    .id("supplier")
    .displayName("Fornecedor")
    .icon(IconUser)
    .accessor((row) => row.user.name || "Não informado")
    .transformOptionFn((value) => ({
      label: value,
      value: value,
    }))
    .build(),

  // Delivery Type Column
  dtf
    .option()
    .id("deliveryType")
    .displayName("Tipo de Entrega")
    .icon(IconTruck)
    .accessor((row) => row.deliveryType.name)
    .transformOptionFn((value) => ({
      label: value,
      value: value,
    }))
    .build(),
];
