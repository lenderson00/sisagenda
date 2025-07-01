import type { NotificationType } from "@prisma/client";
import { notificationService } from "./notification-service";
import type { NotificationEvent } from "./notification-types";

/**
 * Utility functions to dispatch notifications from appointment operations
 * These functions make it easy to integrate notifications into existing services
 */

/**
 * Dispatch a notification for appointment-related events
 *
 * @param params - Event parameters
 * @returns Promise<void>
 */
export async function dispatchAppointmentNotification(params: {
  type: NotificationType;
  appointmentId: string;
  organizationId: string;
  triggeredByUserId: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const event: NotificationEvent = {
    type: params.type,
    appointmentId: params.appointmentId,
    organizationId: params.organizationId,
    triggeredByUserId: params.triggeredByUserId,
    metadata: params.metadata,
  };

  try {
    const result = await notificationService.dispatch(event);

    if (!result.success) {
      console.error(
        "[NotificationUtils] Failed to dispatch notification:",
        result.errors,
      );
    }
  } catch (error) {
    console.error("[NotificationUtils] Error dispatching notification:", error);
  }
}

/**
 * Convenience functions for specific appointment events
 */

export async function notifyAppointmentCreated(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_CREATED",
    appointmentId,
    organizationId,
    triggeredByUserId,
  });
}

export async function notifyAppointmentConfirmed(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_CONFIRMED",
    appointmentId,
    organizationId,
    triggeredByUserId,
  });
}

export async function notifyAppointmentRejected(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
  reason?: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_REJECTED",
    appointmentId,
    organizationId,
    triggeredByUserId,
    metadata: { reason },
  });
}

export async function notifyAppointmentCancelled(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
  reason?: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_CANCELLED",
    appointmentId,
    organizationId,
    triggeredByUserId,
    metadata: { reason },
  });
}

export async function notifyAppointmentRescheduleRequested(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
  newDate: Date,
  reason?: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_RESCHEDULE_REQUESTED",
    appointmentId,
    organizationId,
    triggeredByUserId,
    metadata: { newDate: newDate.toISOString(), reason },
  });
}

export async function notifyAppointmentUpdated(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
  changes?: Record<string, any>,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_UPDATED",
    appointmentId,
    organizationId,
    triggeredByUserId,
    metadata: { changes },
  });
}

export async function notifyAppointmentCompleted(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_COMPLETED",
    appointmentId,
    organizationId,
    triggeredByUserId,
  });
}

export async function notifyAppointmentSupplierNoShow(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_SUPPLIER_NO_SHOW",
    appointmentId,
    organizationId,
    triggeredByUserId,
  });
}

export async function notifyAppointmentRescheduled(
  appointmentId: string,
  organizationId: string,
  triggeredByUserId: string,
  previousDate?: Date,
) {
  return dispatchAppointmentNotification({
    type: "APPOINTMENT_RESCHEDULED",
    appointmentId,
    organizationId,
    triggeredByUserId,
    metadata: { previousDate: previousDate?.toISOString() },
  });
}
