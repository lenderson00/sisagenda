"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useAllowedActions } from "../_context/actions-context";
import type { AppointmentWithRelationsAndStringPrice } from "../types/app";
import { AppointmentActionButtons } from "./appointment-action-buttons";

interface AppointmentActionsProps {
  appointment: AppointmentWithRelationsAndStringPrice;
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
  const allowedActions = useAllowedActions();
  return (
    <AppointmentActionButtons
      appointment={initialAppointment}
      allowedActions={allowedActions}
    />
  );
}
