import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { Building, Calendar, Clock, FileText, Package } from "lucide-react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
  organization?: {
    name: string;
  };
};

const dtf = createColumnConfigHelper<AppointmentWithRelations>();

export const columnsConfig = [
  dtf
    .text()
    .id("ordemDeCompra")
    .displayName("Ordem de Compra")
    .icon(FileText)
    .accessor((appointment) => appointment.ordemDeCompra)
    .build(),
  dtf
    .option()
    .id("organization")
    .displayName("Organização Militar")
    .icon(Building)
    .accessor((appointment) => appointment.organization?.name || "")
    .transformOptionFn((value) => ({
      label: value || "Sem Organização",
      value: value || "",
    }))
    .build(),
  dtf
    .option()
    .id("deliveryType")
    .displayName("Tipo de Entrega")
    .icon(Package)
    .accessor((appointment) => appointment.deliveryType.name)
    .transformOptionFn((value) => ({
      label: value,
      value: value,
    }))
    .build(),
  dtf
    .date()
    .id("date")
    .displayName("Data")
    .icon(Calendar)
    .accessor((appointment) => new Date(appointment.date))
    .build(),
  dtf
    .option()
    .id("status")
    .displayName("Status")
    .icon(Clock)
    .accessor((appointment) => appointment.status)
    .options([
      { label: "Pendente de Confirmação", value: "PENDING_CONFIRMATION" },
      { label: "Confirmado", value: "CONFIRMED" },
      { label: "Rejeitado", value: "REJECTED" },
      { label: "Cancelamento Solicitado", value: "CANCELLATION_REQUESTED" },
      { label: "Cancelamento Rejeitado", value: "CANCELLATION_REJECTED" },
      { label: "Cancelado", value: "CANCELLED" },
      { label: "Reagendamento Solicitado", value: "RESCHEDULE_REQUESTED" },
      { label: "Reagendamento Confirmado", value: "RESCHEDULE_CONFIRMED" },
      { label: "Reagendamento Rejeitado", value: "RESCHEDULE_REJECTED" },
      { label: "Reagendado", value: "RESCHEDULED" },
      { label: "Concluído", value: "COMPLETED" },
      { label: "Fornecedor Não Compareceu", value: "SUPPLIER_NO_SHOW" },
    ])
    .build(),
];
