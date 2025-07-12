"use client";

import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { useSupplierView } from "../_context/view-context";
import { AgendaPageSkeleton } from "./_components/agenda-page-skeleton";
import { AppointmentsCalendarView } from "./_components/appointments-calendar";
import { AppointmentsHeader } from "./_components/appointments-header";
import { AgendaDataTable } from "./_components/data-table";
import { useAppointments } from "./_hooks/agenda-queries";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
  organization?: {
    name: string;
  };
};

export function AgendaPageClient() {
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
