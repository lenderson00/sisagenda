import type {
  NotificationStatus,
  NotificationType,
  Prisma,
} from "@prisma/client";

// Event types that can trigger notifications
export interface NotificationEvent {
  type: NotificationType;
  appointmentId: string;
  organizationId: string;
  triggeredByUserId: string;
  metadata?: Record<string, any>;
}

// Data required to create a notification
export interface NotificationData {
  title: string;
  content: string;
  payload?: Prisma.JsonValue;
  type: NotificationType;
  userId: string;
  organizationId: string;
  appointmentId?: string;
}

// Event handlers interface
export interface NotificationEventHandler {
  handle(event: NotificationEvent): Promise<NotificationData[]>;
}

// Configuration for notification handlers
export interface NotificationHandlerConfig {
  type: NotificationType;
  handler: NotificationEventHandler;
}

// User context for filtering recipients
export interface NotificationRecipientContext {
  organizationId: string;
  excludeUserId?: string; // Exclude the user who triggered the event
  includeRoles?: string[]; // Only include users with specific roles
  excludeRoles?: string[]; // Exclude users with specific roles
}

// Notification dispatch result
export interface NotificationDispatchResult {
  success: boolean;
  notificationsCreated: number;
  errors: string[];
}
