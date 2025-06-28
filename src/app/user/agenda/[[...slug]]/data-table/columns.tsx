import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import type { AppointmentWithRelations } from "../page-client";

const dtf = createColumnConfigHelper<AppointmentWithRelations>();

export const columnsConfig = [
  // Status Column
  dtf
    .option()
    .id("status")
    .displayName("Status")
    .icon(IconCircleCheckFilled)
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
        label: "Pedido de Cancelamento",
        value: "CANCELLATION_REQUESTED",
      },
      {
        label: "Pedido de Cancelamento Rejeitado",
        value: "CANCELLATION_REJECTED",
      },
      {
        label: "Cancelado",
        value: "CANCELLED",
      },
      {
        label: "Reagendamento Solicitado",
        value: "RESCHEDULE_REQUESTED",
      },
      {
        label: "Reagendamento Confirmado",
        value: "RESCHEDULE_CONFIRMED",
      },
      // {
      //   label: "Reagendamento Rejeitado",
      //   value: "RESCHEDULE_REJECTED",
      // },
      // {
      //   label: "Reagendado",
      //   value: "RESCHEDULED",
      // },
      {
        label: "Concluído",
        value: "COMPLETED",
      },
      {
        label: "Fornecedor Não Compareceu",
        value: "SUPPLIER_NO_SHOW",
      },
    ])
    .build(),

  // Appointment Date Column
  dtf
    .date()
    .id("date")
    .displayName("Data de Agendamento")
    .icon(IconCalendar)
    .accessor((row) => new Date(row.date))
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
