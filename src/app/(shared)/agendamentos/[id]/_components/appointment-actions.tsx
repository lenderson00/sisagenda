"use client";

import type { AppointmentWithRelations } from "../types/app";
import { AppointmentActionButtons } from "./appointment-action-buttons";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface AppointmentActionsProps {
  appointment: AppointmentWithRelations;
}

export type AllowedActions = {
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canReschedule: boolean;
  canRequestCancellation: boolean;
  canRequestReschedule: boolean;
  canEdit: boolean;
  canMarkAsNoShow: boolean;
  canMarkAsCompleted: boolean;
  canApproveOrRejectCancellation: boolean;
  canApproveOrRejectReschedule: boolean;
};

export function AppointmentActions({
  appointment: initialAppointment,
}: AppointmentActionsProps) {
  const { data: session } = useSession();

  const { data: appointment } = useQuery<AppointmentWithRelations>({
    queryKey: ["appointment", initialAppointment.id],
    queryFn: async () => {
      const res = await fetch(`/api/appointments/${initialAppointment.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch appointment data");
      }
      return res.json();
    },
    initialData: initialAppointment,
  });

  const allowedActions = useMemo<AllowedActions>(() => {
    const actions: AllowedActions = {
      canApprove: false,
      canReject: false,
      canCancel: false,
      canReschedule: false,
      canRequestCancellation: false,
      canRequestReschedule: false,
      canEdit: false,
      canMarkAsNoShow: false,
      canMarkAsCompleted: false,
      canApproveOrRejectCancellation: false,
      canApproveOrRejectReschedule: false,
    };

    if (!session?.user || !appointment) {
      return actions;
    }

    const { user } = session;
    const { status, date } = appointment;

    if (user.role === "ADMIN") {
      switch (status) {
        case "PENDING_CONFIRMATION":
          actions.canApprove = true;
          actions.canReject = true;
          break;
        case "CANCELLATION_REQUESTED":
          actions.canApproveOrRejectCancellation = true;
          break;
        case "RESCHEDULE_REQUESTED":
          actions.canApproveOrRejectReschedule = true;
          break;
        case "CONFIRMED":
          actions.canCancel = true;
          actions.canReschedule = true;
          if (new Date(date) < new Date()) {
            actions.canMarkAsNoShow = true;
            actions.canMarkAsCompleted = true;
          }
          break;
        default:
          // No actions for other statuses for ADMIN
          break;
      }
    }

    if (user.role === "FORNECEDOR") {
      if (status === "PENDING_CONFIRMATION") {
        actions.canEdit = true;
      }
      if (status === "CONFIRMED" || status === "PENDING_CONFIRMATION") {
        actions.canRequestCancellation = true;
        actions.canRequestReschedule = true;
      }
    }
    return actions;
  }, [session, appointment]);

  if (!session?.user) {
    return null;
  }

  return (
    <AppointmentActionButtons
      appointment={appointment}
      allowedActions={allowedActions}
    />
  );
}
