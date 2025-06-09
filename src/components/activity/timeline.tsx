import { Badge } from "@/components/ui/badge";
import {
  ActivityType,
  type AppointmentActivity as PrismaAppointmentActivity,
  type User,
} from "@prisma/client";
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

type AppointmentActivity = PrismaAppointmentActivity & {
  user: User;
};

interface AppointmentTimelineEventItemProps {
  event: AppointmentActivity;
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
        icon: "border-gray-200 bg-gray-100 text-gray-600",
        dot: "bg-gray-500",
        line: "bg-gray-200",
      },
      rescheduled: {
        icon: "border-yellow-200 bg-yellow-100 text-yellow-600",
        dot: "bg-yellow-500",
        line: "bg-yellow-200",
      },
      default: {
        icon: "border-gray-200 bg-gray-100 text-gray-600",
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
    <div className="group relative flex animate-fade-in items-start space-x-4 pb-6">
      {/* Linha vertical conectora */}
      <div className="absolute left-6 top-12 h-full w-0.5 bg-gray-200 group-last:hidden" />

      {/* Ícone do evento */}
      <div
        className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-105 ${styling.icon} ${isImportant ? "shadow-lg" : "shadow-sm"}`}
      >
        {getEventIcon(eventKey)}
        {isImportant && (
          <div
            className={`absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full ${styling.dot}`}
          />
        )}
      </div>

      {/* Conteúdo do evento */}
      <div className="min-w-0 flex-1 rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="p-4">
          {/* Header do evento */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={event.user.image || "/default-avatar.png"}
                alt={event.user.name || "User"}
                className="h-6 w-6 rounded-full border"
              />
              <span className="text-sm font-medium text-gray-900">
                {event.user.name}
              </span>
              {isImportant && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Importante
                </Badge>
              )}
            </div>

            <span className="text-xs text-gray-500">
              {new Date(event.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>

          {/* Descrição do evento */}
          <div className="text-sm leading-relaxed text-gray-700">
            <p className="font-semibold">{event.title}</p>
            {event.content && <p>{event.content}</p>}
          </div>

          {/* Informações adicionais para eventos específicos */}
          {event.type === ActivityType.UPDATED && metadata?.address && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center space-x-2 text-sm text-green-800">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  Endereço validado e confirmado
                </span>
              </div>
            </div>
          )}

          {event.type === ActivityType.ASSIGNED && metadata?.driverName && (
            <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
              <div className="flex items-center space-x-2 text-sm text-purple-800">
                <UserIcon className="h-4 w-4" />
                <span>
                  Entregador <strong>{metadata.driverName}</strong> foi
                  notificado
                </span>
              </div>
            </div>
          )}

          {(event.type === ActivityType.SUPPLIER_NO_SHOW ||
            event.type === ActivityType.CANCELLED) &&
            metadata?.reason && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="text-sm text-red-800">
                  <strong>Motivo:</strong> {metadata.reason}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
