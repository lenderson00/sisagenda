"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import { IconCalendar, IconTruck, IconBuilding } from "@tabler/icons-react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  organization: Organization;
  user: User;
};

async function getSupplierAppointments(
  supplierId: string,
): Promise<AppointmentWithRelations[]> {
  const response = await fetch(`/api/suppliers/${supplierId}/appointments`);
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    {
      variant: "default" | "destructive" | "secondary" | "outline";
      label: string;
    }
  > = {
    PENDING_CONFIRMATION: { variant: "outline", label: "Pendente" },
    CONFIRMED: { variant: "default", label: "Confirmado" },
    CANCELLED: { variant: "destructive", label: "Cancelado" },
    COMPLETED: { variant: "secondary", label: "Concluído" },
    CANCELLATION_REQUESTED: {
      variant: "outline",
      label: "Cancelamento Solicitado",
    },
    RESCHEDULE_REQUESTED: {
      variant: "outline",
      label: "Reagendamento Solicitado",
    },
    SUPPLIER_NO_SHOW: { variant: "destructive", label: "Fornecedor Faltou" },
  };

  const statusInfo = statusMap[status] || {
    variant: "outline" as const,
    label: status,
  };
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export function AppointmentsList({ supplierId }: { supplierId: string }) {
  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["supplier-appointments", supplierId],
    queryFn: () => getSupplierAppointments(supplierId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar os agendamentos.
        </p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <IconCalendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">
          Nenhum agendamento encontrado para este fornecedor.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>Tipo de Entrega</TableHead>
            <TableHead>Organização</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Duração</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(appointment.date).toLocaleDateString("pt-BR")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <IconTruck className="h-4 w-4 text-muted-foreground" />
                  {appointment.deliveryType.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <IconBuilding className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {appointment.organization.sigla}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.organization.name}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{appointment.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.user.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-muted-foreground">
                {appointment.duration}min
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
