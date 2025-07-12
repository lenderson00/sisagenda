import { prisma } from "../prisma";
import type {
  NotificationData,
  NotificationEvent,
  NotificationEventHandler,
  NotificationRecipientContext,
} from "./notification-types";

// Base handler class with common functionality
abstract class BaseNotificationHandler implements NotificationEventHandler {
  abstract handle(event: NotificationEvent): Promise<NotificationData[]>;

  protected async getAppointmentDetails(appointmentId: string) {
    return prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        User: { select: { name: true, email: true } },
        Supplier: { select: { name: true, email: true } },
        deliveryType: { select: { name: true } },
        organization: { select: { name: true, sigla: true } },
      },
    });
  }

  protected async getOrganizationUsers(
    context: NotificationRecipientContext,
  ): Promise<string[]> {
    const where: any = {
      organizationId: context.organizationId,
      isActive: true,
    };

    if (context.excludeUserId) {
      where.id = { not: context.excludeUserId };
    }

    if (context.includeRoles && context.includeRoles.length > 0) {
      where.role = { in: context.includeRoles };
    }

    if (context.excludeRoles && context.excludeRoles.length > 0) {
      where.role = { notIn: context.excludeRoles };
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    });

    return users.map((user) => user.id);
  }
}

// Handler for appointment creation
export class AppointmentCreatedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const userIds = await this.getOrganizationUsers({
      organizationId: event.organizationId,
      excludeUserId: event.triggeredByUserId,
    });

    const creatorName = appointment.User?.name ?? appointment.Supplier?.name;

    return userIds.map((userId) => ({
      title: "Novo Agendamento Criado",
      content: `Um novo agendamento foi criado por ${creatorName ?? "desconhecido"
        } para ${appointment.deliveryType.name}`,
      payload: {
        appointmentId: event.appointmentId,
        supplierName: creatorName,
        deliveryType: appointment.deliveryType.name,
        date: appointment.date.toISOString(),
        internalId: appointment.internalId,
      },
      type: event.type,
      userId,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    }));
  }
}

// Handler for appointment confirmation
export class AppointmentConfirmedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notification: NotificationData = {
      title: "Agendamento Confirmado",
      content: `Seu agendamento para ${appointment.deliveryType.name} foi confirmado pela organização`,
      payload: {
        appointmentId: event.appointmentId,
        deliveryType: appointment.deliveryType.name,
        date: appointment.date.toISOString(),
        organizationName: appointment.organization.name,
        internalId: appointment.internalId,
      },
      type: event.type,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    };

    if (appointment.userId) {
      notification.userId = appointment.userId;
    } else if (appointment.supplierId) {
      notification.supplierId = appointment.supplierId;
    } else {
      return []; // Or log an error, as this case is unexpected
    }

    return [notification];
  }
}

// Handler for appointment rejection
export class AppointmentRejectedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notification: NotificationData = {
      title: "Agendamento Rejeitado",
      content: `Seu agendamento para ${appointment.deliveryType.name} foi rejeitado pela organização`,
      payload: {
        appointmentId: event.appointmentId,
        deliveryType: appointment.deliveryType.name,
        date: appointment.date.toISOString(),
        organizationName: appointment.organization.name,
        internalId: appointment.internalId,
        reason: event.metadata?.reason || "Não especificado",
      },
      type: event.type,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    };

    if (appointment.userId) {
      notification.userId = appointment.userId;
    } else if (appointment.supplierId) {
      notification.supplierId = appointment.supplierId;
    } else {
      return [];
    }

    return [notification];
  }
}

// Handler for appointment cancellation
export class AppointmentCancelledHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notifications: NotificationData[] = [];
    const creatorName = appointment.User?.name ?? appointment.Supplier?.name;
    // This logic might need review depending on how supplier actions are tracked
    const isCancelledByCreator = event.triggeredByUserId === appointment.userId;

    // If cancelled by organization (or someone other than the User creator), notify creator
    if (!isCancelledByCreator) {
      const notification: NotificationData = {
        title: "Agendamento Cancelado",
        content: `Seu agendamento para ${appointment.deliveryType.name} foi cancelado pela organização`,
        payload: {
          appointmentId: event.appointmentId,
          deliveryType: appointment.deliveryType.name,
          date: appointment.date.toISOString(),
          organizationName: appointment.organization.name,
          internalId: appointment.internalId,
          reason: event.metadata?.reason || "Não especificado",
        },
        type: event.type,
        organizationId: event.organizationId,
        appointmentId: event.appointmentId,
      };
      if (appointment.userId) {
        notification.userId = appointment.userId;
      } else if (appointment.supplierId) {
        notification.supplierId = appointment.supplierId;
      }

      if (notification.userId || notification.supplierId) {
        notifications.push(notification);
      }
    } else {
      // If cancelled by User creator, notify organization users
      const userIds = await this.getOrganizationUsers({
        organizationId: event.organizationId,
        excludeUserId: event.triggeredByUserId,
      });

      notifications.push(
        ...userIds.map((userId) => ({
          title: "Agendamento Cancelado pelo Criador",
          content: `O agendamento de ${creatorName ?? "desconhecido"
            } para ${appointment.deliveryType.name} foi cancelado`,
          payload: {
            appointmentId: event.appointmentId,
            supplierName: creatorName,
            deliveryType: appointment.deliveryType.name,
            date: appointment.date.toISOString(),
            internalId: appointment.internalId,
            reason: event.metadata?.reason || "Não especificado",
          },
          type: event.type,
          userId,
          organizationId: event.organizationId,
          appointmentId: event.appointmentId,
        })),
      );
    }

    return notifications;
  }
}

// Handler for reschedule requests
export class AppointmentRescheduleRequestedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    // Notify organization users about reschedule request
    const userIds = await this.getOrganizationUsers({
      organizationId: event.organizationId,
      excludeUserId: event.triggeredByUserId,
      includeRoles: ["ADMIN", "USER"], // Only notify admins and users
    });

    const creatorName = appointment.User?.name ?? appointment.Supplier?.name;

    return userIds.map((userId) => ({
      title: "Solicitação de Reagendamento",
      content: `${creatorName ?? "desconhecido"
        } solicitou reagendamento para ${appointment.deliveryType.name}`,
      payload: {
        appointmentId: event.appointmentId,
        supplierName: creatorName,
        deliveryType: appointment.deliveryType.name,
        currentDate: appointment.date.toISOString(),
        requestedDate: event.metadata?.newDate,
        reason: event.metadata?.reason || "Não especificado",
        internalId: appointment.internalId,
      },
      type: event.type,
      userId,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    }));
  }
}

// Handler for appointment updates
export class AppointmentUpdatedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notifications: NotificationData[] = [];
    const isUpdatedByCreator = event.triggeredByUserId === appointment.userId;

    // If updated by someone other than the User creator, notify creator
    if (!isUpdatedByCreator) {
      const notification: NotificationData = {
        title: "Agendamento Atualizado",
        content: `Seu agendamento para ${appointment.deliveryType.name} foi atualizado`,
        payload: {
          appointmentId: event.appointmentId,
          deliveryType: appointment.deliveryType.name,
          date: appointment.date.toISOString(),
          organizationName: appointment.organization.name,
          internalId: appointment.internalId,
          changes: event.metadata?.changes || {},
        },
        type: event.type,
        organizationId: event.organizationId,
        appointmentId: event.appointmentId,
      };

      if (appointment.userId) {
        notification.userId = appointment.userId;
      } else if (appointment.supplierId) {
        notification.supplierId = appointment.supplierId;
      }

      if (notification.userId || notification.supplierId) {
        notifications.push(notification);
      }
    }

    return notifications;
  }
}

// Handler for completed appointments
export class AppointmentCompletedHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notification: NotificationData = {
      title: "Agendamento Concluído",
      content: `Seu agendamento para ${appointment.deliveryType.name} foi marcado como concluído`,
      payload: {
        appointmentId: event.appointmentId,
        deliveryType: appointment.deliveryType.name,
        date: appointment.date.toISOString(),
        organizationName: appointment.organization.name,
        internalId: appointment.internalId,
      },
      type: event.type,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    };

    if (appointment.userId) {
      notification.userId = appointment.userId;
    } else if (appointment.supplierId) {
      notification.supplierId = appointment.supplierId;
    } else {
      return [];
    }

    return [notification];
  }
}

// Handler for supplier no-show
export class AppointmentSupplierNoShowHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notification: NotificationData = {
      title: "Agendamento - Não Comparecimento",
      content: `Seu agendamento para ${appointment.deliveryType.name} foi marcado como não comparecimento`,
      payload: {
        appointmentId: event.appointmentId,
        deliveryType: appointment.deliveryType.name,
        date: appointment.date.toISOString(),
        organizationName: appointment.organization.name,
        internalId: appointment.internalId,
      },
      type: event.type,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    };

    if (appointment.userId) {
      notification.userId = appointment.userId;
    } else if (appointment.supplierId) {
      notification.supplierId = appointment.supplierId;
    } else {
      return [];
    }

    return [notification];
  }
}

// Handler for rescheduled appointments
export class AppointmentRescheduledHandler extends BaseNotificationHandler {
  async handle(event: NotificationEvent): Promise<NotificationData[]> {
    const appointment = await this.getAppointmentDetails(event.appointmentId);
    if (!appointment) return [];

    const notification: NotificationData = {
      title: "Agendamento Reagendado",
      content: `Seu agendamento para ${appointment.deliveryType.name} foi reagendado`,
      payload: {
        appointmentId: event.appointmentId,
        deliveryType: appointment.deliveryType.name,
        newDate: appointment.date.toISOString(),
        previousDate: event.metadata?.previousDate,
        organizationName: appointment.organization.name,
        internalId: appointment.internalId,
      },
      type: event.type,
      organizationId: event.organizationId,
      appointmentId: event.appointmentId,
    };

    if (appointment.userId) {
      notification.userId = appointment.userId;
    } else if (appointment.supplierId) {
      notification.supplierId = appointment.supplierId;
    } else {
      return [];
    }

    return [notification];
  }
}
