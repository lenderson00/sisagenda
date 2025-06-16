"use client";

import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppointmentsCalendarView } from "./_components/appointments-calendar";
import { AppointmentsHeader } from "./_components/appointments-header";
import { AppointmentsList } from "./_components/appointments-list";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

async function getAppointments(): Promise<AppointmentWithRelations[]> {
  const response = await fetch("/api/appointments");
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto py-8 space-y-4">
        <AppointmentsHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        {isLoading ? (
          <div className="text-center py-10">Loading appointments...</div>
        ) : (
          <>
            {viewMode === "calendar" ? (
              <AppointmentsCalendarView appointments={appointments || []} />
            ) : (
              <AppointmentsList
                initialAppointments={appointments || []}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
