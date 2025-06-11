"use client";

import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type combines the Prisma types into what our API returns.
type FullAppointment = Appointment & {
  organization: Organization;
  user: User;
  deliveryType: DeliveryType;
};

export type AppointmentColumn = {
  id: string;
  organizationName: string;
  userName: string | null;
  date: string;
  status: string;
  deliveryTypeName: string;
  ordemDeCompra: string;
};

// We are creating a flattened structure for the data table
export const transformAppointmentToColumn = (
  app: FullAppointment,
): AppointmentColumn => ({
  id: app.id,
  organizationName: app.organization.name,
  userName: app.user.name,
  date: format(new Date(app.date), "dd/MM/yyyy HH:mm"),
  status: app.status,
  deliveryTypeName: app.deliveryType.name,
  ordemDeCompra: app.ordemDeCompra,
});

export const columns: ColumnDef<AppointmentColumn>[] = [
  {
    accessorKey: "organizationName",
    header: "Organização",
  },
  {
    accessorKey: "userName",
    header: "Usuário/Fornecedor",
  },
  {
    accessorKey: "date",
    header: "Data e Hora",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "deliveryTypeName",
    header: "Tipo de Entrega",
  },
  {
    accessorKey: "ordemDeCompra",
    header: "Ordem de Compra",
  },
];
