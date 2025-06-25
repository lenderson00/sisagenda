import { useQuery } from "@tanstack/react-query";
import { agendaKeys } from "./agenda-keys";
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

async function getAppointments(): Promise<AppointmentWithRelations[]> {
  const response = await fetch("/api/appointments");
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export function useAppointments() {
  return useQuery({
    queryKey: agendaKeys.lists(),
    queryFn: getAppointments,
  });
}
