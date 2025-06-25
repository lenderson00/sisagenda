"use client";

import { useAppointments } from "./_hooks/agenda-queries";
import { AgendaDataTable } from "./_components/data-table";
import { AppointmentsHeader } from "./_components/appointments-header";
import { AppointmentsCalendarView } from "./_components/appointments-calendar";
import { AgendaPageSkeleton } from "./_components/agenda-page-skeleton";
import { useSupplierView } from "../_context/view-context";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
  organization?: {
    name: string;
  };
};

interface AgendaPageClientProps {
  organizationId: string;
}

export function AgendaPageClient({ organizationId }: AgendaPageClientProps) {
  const { viewMode } = useSupplierView();
  const { data: appointments = [], isLoading } = useAppointments();

  if (isLoading) {
    return <AgendaPageSkeleton />;
  }

  return (
    <>
      <AppointmentsHeader />
      <div className="p-4">
        {viewMode === "calendar" ? (
          <AppointmentsCalendarView appointments={appointments} />
        ) : (
          <AgendaDataTable data={appointments} />
        )}
      </div>
    </>
  );
}
