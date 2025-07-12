"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import {
  Calendar,
  Clock,
  User,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { RiCalendarCheckLine } from "@remixicon/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  AgendaView,
  type CalendarEvent,
  type CalendarView,
  DayView,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "@/components/event-calendar";
import { AgendaDaysToShow } from "@/components/event-calendar/constants";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

interface AppointmentsCalendarViewProps {
  appointments: AppointmentWithRelations[];
}

// Delivery type color mapping for events
const getDeliveryTypeColor = (
  deliveryTypeId: string,
): "sky" | "emerald" | "rose" | "amber" => {
  const colorMap = {
    "1": "sky" as const,
    "2": "emerald" as const,
    "3": "rose" as const,
    default: "amber" as const,
  };
  return colorMap[deliveryTypeId as keyof typeof colorMap] || colorMap.default;
};

// Appointment detail component
interface AppointmentDetailProps {
  appointment: AppointmentWithRelations;
}

function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  const getDeliveryTypeColorClass = (deliveryTypeId: string) => {
    const colors = {
      "1": "bg-blue-500 hover:bg-blue-600",
      "2": "bg-green-500 hover:bg-green-600",
      "3": "bg-red-500 hover:bg-red-600",
      default: "bg-gray-500 hover:bg-gray-600",
    };
    return colors[deliveryTypeId as keyof typeof colors] || colors.default;
  };

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <Badge
            className={`text-white ${getDeliveryTypeColorClass(appointment.deliveryTypeId)}`}
          >
            {appointment.deliveryType?.name || "Unknown Type"}
          </Badge>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(appointment.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>User: {appointment.userId}</span>
          </div>
        </div>

        {typeof appointment.observations === "string" &&
          appointment.observations.trim() !== "" && (
            <div className="text-sm text-gray-600 bg-white p-2 rounded border">
              <strong>Observações:</strong> {appointment.observations}
            </div>
          )}
      </div>
    </div>
  );
}

// Custom Calendar Component (without DnD)
interface CustomEventCalendarProps {
  events: CalendarEvent[];
  appointments: AppointmentWithRelations[];
  onEventSelect: (event: CalendarEvent) => void;
  className?: string;
  initialView?: CalendarView;
}

function CustomEventCalendar({
  events,
  appointments,
  onEventSelect,
  className,
  initialView = "month",
}: CustomEventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventCreate = () => {
    // Disabled for read-only mode
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      }
      return `${format(start, "MMM", { locale: ptBR })} - ${format(end, "MMM yyyy", { locale: ptBR })}`;
    }
    if (view === "day") {
      return format(currentDate, "EEE MMMM d, yyyy", { locale: ptBR });
    }
    if (view === "agenda") {
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      }
      return `${format(start, "MMM", { locale: ptBR })} - ${format(end, "MMM yyyy", { locale: ptBR })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale: ptBR });
  }, [currentDate, view]);

  return (
    <div
      className="flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex items-center justify-between p-2 sm:p-4",
          className,
        )}
      >
        <div className="flex items-center gap-1 sm:gap-4">
          <Button
            variant="outline"
            className="max-[479px]:aspect-square max-[479px]:p-0!"
            onClick={handleToday}
          >
            <RiCalendarCheckLine
              className="min-[480px]:hidden"
              size={16}
              aria-hidden="true"
            />
            <span className="max-[479px]:sr-only">Hoje</span>
          </Button>
          <div className="flex items-center sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              aria-label="Anterior"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              aria-label="Próximo"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </div>
          <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
            {viewTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                <span>
                  <span className="min-[480px]:hidden" aria-hidden="true">
                    {view.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-[479px]:sr-only">
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </span>
                </span>
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setView("month")}>
                Mês <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("week")}>
                Semana <DropdownMenuShortcut>S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("day")}>
                Dia <DropdownMenuShortcut>D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("agenda")}>
                Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventSelect={onEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventSelect={onEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventSelect={onEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventSelect={onEventSelect}
          />
        )}
      </div>
    </div>
  );
}

export function AppointmentsCalendarView({
  appointments,
}: AppointmentsCalendarViewProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Convert appointments to CalendarEvent format
  const calendarEvents = useMemo(() => {
    return appointments.map((appointment): CalendarEvent => {
      const appointmentDate = new Date(appointment.date);

      return {
        id: appointment.id,
        title: appointment.deliveryType?.name || "Unknown Type",
        description: (appointment.observations as string) || "",
        start: appointmentDate,
        end: appointmentDate, // Same as start for single point in time
        allDay: false,
        color: getDeliveryTypeColor(appointment.deliveryTypeId),
        location: `User: ${appointment.userId}`,
      };
    });
  }, [appointments]);

  const handleEventSelect = (event: CalendarEvent) => {
    // Find the corresponding appointment
    const appointment = appointments.find((app) => app.id === event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setModalTitle(
        `Agendamento para ${new Date(appointment.date).toLocaleDateString(
          "pt-BR",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )}`,
      );
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 border-none">
        <CardContent className="p-0">
          <CustomEventCalendar
            events={calendarEvents}
            appointments={appointments}
            onEventSelect={handleEventSelect}
            initialView="month"
          />
        </CardContent>
      </Card>

      {/* Appointment details modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAppointment ? (
              <AppointmentDetail appointment={selectedAppointment} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhum agendamento</p>
                <p className="text-sm">Não há agendamentos para esta data.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
