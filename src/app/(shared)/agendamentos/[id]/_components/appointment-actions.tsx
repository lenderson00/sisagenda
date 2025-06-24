import { auth } from "@/lib/auth";
import type { AppointmentWithRelations } from "../types/app";
import { AppointmentActionButtons } from "./appointment-action-buttons";

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

export async function AppointmentActions({
  appointment,
}: AppointmentActionsProps) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const { user } = session;
  const { status, date } = appointment;

  const allowedActions: AllowedActions = {
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

  if (user.role === "ADMIN") {
    if (status === "PENDING_CONFIRMATION") {
      allowedActions.canApprove = true;
      allowedActions.canReject = true;
    }
    if (status === "CANCELLATION_REQUESTED") {
      allowedActions.canApproveOrRejectCancellation = true;
    }
    if (status === "RESCHEDULE_REQUESTED") {
      allowedActions.canApproveOrRejectReschedule = true;
    }
    if (status === "CONFIRMED" || status === "PENDING_CONFIRMATION") {
      allowedActions.canCancel = true;
      allowedActions.canReschedule = true;
    }
    if (status === "CONFIRMED" && new Date(date) < new Date()) {
      allowedActions.canMarkAsNoShow = true;
      allowedActions.canMarkAsCompleted = true;
    }
  }

  if (user.role === "SUPPLIER") {
    if (status === "PENDING_CONFIRMATION") {
      allowedActions.canEdit = true;
    }
    if (status === "CONFIRMED" || status === "PENDING_CONFIRMATION") {
      allowedActions.canRequestCancellation = true;
      allowedActions.canRequestReschedule = true;
    }
  }

  return (
    <AppointmentActionButtons
      appointment={appointment}
      allowedActions={allowedActions}
    />
  );
}
