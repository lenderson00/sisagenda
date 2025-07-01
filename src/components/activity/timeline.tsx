import { Badge } from "@/components/ui/badge";
import {
  ActivityType,
  type AppointmentActivity as PrismaAppointmentActivity,
  type User,
} from "@prisma/client";
import type { AppointmentActivityWithRelations } from "@/types/appointment-activity";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  User as UserIcon,
  XCircle,
} from "lucide-react";

interface AppointmentTimelineEventItemProps {
  event: AppointmentActivityWithRelations;
}

export const AppointmentTimelineEventItem: React.FC<
  AppointmentTimelineEventItemProps
> = ({ event }) => {
  const getEventKey = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CREATED:
        return "appointment_scheduled";
      case ActivityType.COMPLETED:
      case ActivityType.DELIVERY_CONFIRMED:
        return "appointment_completed";
      case ActivityType.SUPPLIER_NO_SHOW:
        return "appointment_failed";
      case ActivityType.CANCELLED:
        return "appointment_cancelled";
      case ActivityType.RESCHEDULE_REQUESTED:
      case ActivityType.RESCHEDULE_CONFIRMED:
      case ActivityType.RESCHEDULE_REJECTED:
      case ActivityType.UPDATED:
        return "rescheduled";
      default:
        return "default";
    }
  };

  const eventKey = getEventKey(event.type);

  const getEventIcon = (key: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      appointment_scheduled: Calendar,
      appointment_completed: CheckCircle,
      appointment_failed: XCircle,
      appointment_cancelled: XCircle,
      rescheduled: Clock,
      default: Package,
    };

    const IconComponent = iconMap[key] || Package;
    return <IconComponent className="h-4 w-4" />;
  };

  const getEventStyling = (key: string) => {
    const styleMap: { [key: string]: any } = {
      appointment_scheduled: {
        icon: "border-blue-200 bg-blue-100 text-blue-600",
        dot: "bg-blue-500",
        line: "bg-blue-200",
      },

      appointment_completed: {
        icon: "border-green-200 bg-green-100 text-green-600",
        dot: "bg-green-500",
        line: "bg-green-200",
      },
      appointment_failed: {
        icon: "border-red-200 bg-red-100 text-red-600",
        dot: "bg-red-500",
        line: "bg-red-200",
      },
      appointment_cancelled: {
        icon: "border-muted bg-gray-100 text-gray-600",
        dot: "bg-gray-500",
        line: "bg-gray-200",
      },
      rescheduled: {
        icon: "border-yellow-200 bg-yellow-100 text-yellow-600",
        dot: "bg-yellow-500",
        line: "bg-yellow-200",
      },
      default: {
        icon: "border-muted bg-gray-100 text-gray-600",
        dot: "bg-gray-500",
        line: "bg-gray-200",
      },
    };

    return styleMap[key] || styleMap.default;
  };

  const styling = getEventStyling(eventKey);
  const isImportant = [
    ActivityType.COMPLETED,
    ActivityType.SUPPLIER_NO_SHOW,
    ActivityType.CANCELLED,
  ].includes(event.type as any);

  const metadata = event.metadata as {
    address?: string;
    driverName?: string;
    reason?: string;
  } | null;

  return (
    <div className="relative">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${styling.icon}`}
          >
            {getEventIcon(eventKey)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {event.user?.name || "Sistema"}
            </span>
            <span className="text-sm text-gray-500">
              {event.type === "COMMENT"
                ? "comentou:"
                : "realizou uma atividade"}
            </span>
            {isImportant && (
              <Badge variant="secondary" className="text-xs">
                Importante
              </Badge>
            )}
          </div>
          {event.content && (
            <p className="text-sm text-gray-700 mt-1">{event.content}</p>
          )}
          {metadata && (
            <div className="mt-2 space-y-1">
              {metadata.address && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {metadata.address}
                </div>
              )}
              {metadata.driverName && (
                <div className="flex items-center text-xs text-gray-500">
                  <UserIcon className="w-3 h-3 mr-1" />
                  {metadata.driverName}
                </div>
              )}
              {metadata.reason && (
                <div className="flex items-center text-xs text-gray-500">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {metadata.reason}
                </div>
              )}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {new Date(event.createdAt).toLocaleString("pt-BR")}
          </div>
        </div>
      </div>
    </div>
  );
};
