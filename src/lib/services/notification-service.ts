import { prisma } from "@/lib/prisma";
import type {
  NotificationEvent,
  NotificationHandlerConfig,
  NotificationDispatchResult,
  NotificationData,
} from "./notification-types";
import {
  AppointmentCreatedHandler,
  AppointmentConfirmedHandler,
  AppointmentRejectedHandler,
  AppointmentCancelledHandler,
  AppointmentRescheduleRequestedHandler,
  AppointmentUpdatedHandler,
  AppointmentCompletedHandler,
  AppointmentSupplierNoShowHandler,
  AppointmentRescheduledHandler,
} from "./notification-handlers";

export class NotificationService {
  private handlers: Map<string, NotificationHandlerConfig>;

  constructor() {
    this.handlers = new Map();
    this.registerHandlers();
  }

  /**
   * Register all notification handlers
   * Following the Open/Closed Principle - easy to add new handlers without modifying existing code
   */
  private registerHandlers(): void {
    const handlerConfigs: NotificationHandlerConfig[] = [
      {
        type: "APPOINTMENT_CREATED",
        handler: new AppointmentCreatedHandler(),
      },
      {
        type: "APPOINTMENT_CONFIRMED",
        handler: new AppointmentConfirmedHandler(),
      },
      {
        type: "APPOINTMENT_REJECTED",
        handler: new AppointmentRejectedHandler(),
      },
      {
        type: "APPOINTMENT_CANCELLED",
        handler: new AppointmentCancelledHandler(),
      },
      {
        type: "APPOINTMENT_RESCHEDULE_REQUESTED",
        handler: new AppointmentRescheduleRequestedHandler(),
      },
      {
        type: "APPOINTMENT_UPDATED",
        handler: new AppointmentUpdatedHandler(),
      },
      {
        type: "APPOINTMENT_COMPLETED",
        handler: new AppointmentCompletedHandler(),
      },
      {
        type: "APPOINTMENT_SUPPLIER_NO_SHOW",
        handler: new AppointmentSupplierNoShowHandler(),
      },
      {
        type: "APPOINTMENT_RESCHEDULED",
        handler: new AppointmentRescheduledHandler(),
      },
    ];

    for (const config of handlerConfigs) {
      this.handlers.set(config.type, config);
    }
  }

  /**
   * Single dispatch method to handle all notification events
   * This is the main entry point for the notification system
   *
   * @param event - The notification event to dispatch
   * @returns Promise<NotificationDispatchResult> - Result of the dispatch operation
   */
  async dispatch(event: NotificationEvent): Promise<NotificationDispatchResult> {
    const result: NotificationDispatchResult = {
      success: false,
      notificationsCreated: 0,
      errors: [],
    };

    try {
      // Validate event
      if (!this.validateEvent(event)) {
        result.errors.push("Invalid event data");
        return result;
      }

      // Get the appropriate handler for this event type
      const handlerConfig = this.handlers.get(event.type);
      if (!handlerConfig) {
        result.errors.push(`No handler found for event type: ${event.type}`);
        return result;
      }

      // Execute the handler to get notification data
      const notificationsData = await handlerConfig.handler.handle(event);

      if (notificationsData.length === 0) {
        result.success = true;
        result.notificationsCreated = 0;
        return result;
      }

      // Create notifications in database using transaction for consistency
      const createdNotifications = await this.createNotifications(notificationsData);

      result.success = true;
      result.notificationsCreated = createdNotifications.length;

      console.log(`[NotificationService] Successfully dispatched ${result.notificationsCreated} notifications for event ${event.type}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      result.errors.push(errorMessage);
      console.error(`[NotificationService] Error dispatching event ${event.type}:`, error);
    }

    return result;
  }

  /**
   * Create notifications in the database using a transaction
   *
   * @param notificationsData - Array of notification data to create
   * @returns Promise<any[]> - Created notifications
   */
  private async createNotifications(notificationsData: NotificationData[]): Promise<any[]> {
    return prisma.$transaction(async (tx) => {
      const createdNotifications = [];

      for (const notificationData of notificationsData) {
        try {
          const notification = await tx.notification.create({
            data: {
              title: notificationData.title,
              content: notificationData.content,
              payload: notificationData.payload || {},
              type: notificationData.type,
              userId: notificationData.userId,
              organizationId: notificationData.organizationId,
              appointmentId: notificationData.appointmentId,
              status: "UNREAD", // Default status
            },
          });
          createdNotifications.push(notification);
        } catch (error) {
          console.error("[NotificationService] Error creating notification:", error);
          // Continue with other notifications even if one fails
        }
      }

      return createdNotifications;
    });
  }

  /**
   * Validate notification event data
   *
   * @param event - Event to validate
   * @returns boolean - Whether the event is valid
   */
  private validateEvent(event: NotificationEvent): boolean {
    return !!(
      event.type &&
      event.appointmentId &&
      event.organizationId &&
      event.triggeredByUserId
    );
  }

  /**
   * Get all notifications for a user with pagination
   *
   * @param userId - User ID to get notifications for
   * @param options - Query options (pagination, filters)
   * @returns Promise with notifications and metadata
   */
  async getUserNotifications(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: "UNREAD" | "READ" | "ARCHIVED";
      type?: string;
    } = {}
  ) {
    const { page = 1, limit = 20, status, type } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;
    if (type) where.type = type;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          appointment: {
            select: {
              internalId: true,
              date: true,
              deliveryType: { select: { name: true } },
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notification as read
   *
   * @param notificationId - Notification ID to mark as read
   * @param userId - User ID (for authorization)
   * @returns Promise<boolean> - Success status
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId, // Ensure user can only update their own notifications
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error("[NotificationService] Error marking notification as read:", error);
      return false;
    }
  }

  /**
   * Mark notification as archived
   *
   * @param notificationId - Notification ID to archive
   * @param userId - User ID (for authorization)
   * @returns Promise<boolean> - Success status
   */
  async markAsArchived(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          status: "ARCHIVED",
        },
      });
      return true;
    } catch (error) {
      console.error("[NotificationService] Error archiving notification:", error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   *
   * @param userId - User ID
   * @returns Promise<number> - Number of notifications updated
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          status: "UNREAD",
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      });
      return result.count;
    } catch (error) {
      console.error("[NotificationService] Error marking all notifications as read:", error);
      return 0;
    }
  }

  /**
   * Get unread notification count for a user
   *
   * @param userId - User ID
   * @returns Promise<number> - Count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          status: "UNREAD",
        },
      });
    } catch (error) {
      console.error("[NotificationService] Error getting unread count:", error);
      return 0;
    }
  }
}

// Singleton instance for global use
export const notificationService = new NotificationService();
