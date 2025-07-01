import type { Session } from "next-auth";
import type { AppointmentStatus } from "@prisma/client";

export interface NotificationActions {
  canApprove: boolean;
  canReject: boolean;
  canApproveCancellation: boolean;
  canRejectCancellation: boolean;
  canApproveReschedule: boolean;
  canRejectReschedule: boolean;
}

/**
 * Determine what actions are available for a notification based on appointment status and user role
 * This follows the same business rules as defined in actions-context.tsx
 */
export function getNotificationActions(
  appointmentStatus: AppointmentStatus,
  userRole: Session["user"]["role"],
  appointmentDate?: Date
): NotificationActions {
  const actions: NotificationActions = {
    canApprove: false,
    canReject: false,
    canApproveCancellation: false,
    canRejectCancellation: false,
    canApproveReschedule: false,
    canRejectReschedule: false,
  };

  // Only ADMIN and USER roles can perform approval/rejection actions
  if (userRole !== "ADMIN" && userRole !== "USER") {
    return actions;
  }

  switch (appointmentStatus) {
    case "PENDING_CONFIRMATION":
      if (userRole === "ADMIN") {
        actions.canApprove = true;
        actions.canReject = true;
      } else if (userRole === "USER") {
        actions.canApprove = true;
      }
      break;

    case "CANCELLATION_REQUESTED":
      if (userRole === "ADMIN") {
        actions.canApproveCancellation = true;
        actions.canRejectCancellation = true;
      }
      break;

    case "RESCHEDULE_REQUESTED":
      if (userRole === "ADMIN") {
        actions.canApproveReschedule = true;
        actions.canRejectReschedule = true;
      }
      break;

    default:
      // No actions available for other statuses
      break;
  }

  return actions;
}

/**
 * Get the appropriate action buttons for a notification
 */
export function getNotificationActionButtons(
  notificationType: string,
  appointmentStatus: AppointmentStatus,
  userRole: Session["user"]["role"],
  appointmentDate?: Date
) {
  const actions = getNotificationActions(appointmentStatus, userRole, appointmentDate);

  // Only show action buttons for specific notification types that require action
  if (notificationType === "APPOINTMENT_CREATED" && appointmentStatus === "PENDING_CONFIRMATION") {
    return {
      showActions: actions.canApprove || actions.canReject,
      actions: {
        approve: actions.canApprove,
        reject: actions.canReject,
      },
    };
  }

  if (notificationType === "APPOINTMENT_CANCELLED" && appointmentStatus === "CANCELLATION_REQUESTED") {
    return {
      showActions: actions.canApproveCancellation || actions.canRejectCancellation,
      actions: {
        approveCancellation: actions.canApproveCancellation,
        rejectCancellation: actions.canRejectCancellation,
      },
    };
  }

  if (notificationType === "APPOINTMENT_RESCHEDULE_REQUESTED" && appointmentStatus === "RESCHEDULE_REQUESTED") {
    return {
      showActions: actions.canApproveReschedule || actions.canRejectReschedule,
      actions: {
        approveReschedule: actions.canApproveReschedule,
        rejectReschedule: actions.canRejectReschedule,
      },
    };
  }

  return {
    showActions: false,
    actions: {},
  };
}
