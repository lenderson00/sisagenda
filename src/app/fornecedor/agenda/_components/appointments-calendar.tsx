"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import { useMemo, useState } from "react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

interface AppointmentsCalendarViewProps {
  appointments: AppointmentWithRelations[];
}

// Utility functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const isToday = (date: Date) => {
  return date.toDateString() === new Date().toDateString();
};

const isSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Delivery type color mapping
const getDeliveryTypeColor = (deliveryTypeId: string) => {
  const colors = {
    "1": "bg-blue-500 hover:bg-blue-600",
    "2": "bg-green-500 hover:bg-green-600",
    "3": "bg-red-500 hover:bg-red-600",
    default: "bg-gray-500 hover:bg-gray-600",
  };
  return colors[deliveryTypeId as keyof typeof colors] || colors.default;
};

// Calendar day component
interface CalendarDayProps {
  date: Date | null;
  appointments: AppointmentWithRelations[];
  isToday: boolean;
  onClick: (date: Date) => void;
}

function CalendarDay({
  date,
  appointments,
  isToday,
  onClick,
}: CalendarDayProps) {
  if (!date) {
    return (
      <div className="min-h-[80px] md:min-h-[100px] bg-gray-50 border-b border-r border-muted" />
    );
  }

  const hasAppointments = appointments.length > 0;
  const displayAppointments = appointments.slice(0, 2);
  const remainingCount = appointments.length - 2;

  return (
    <div
      className={cn(
        "min-h-[80px] md:min-h-[100px] p-1 md:p-2 bg-white border-b border-r border-muted relative transition-colors",
        "hover:bg-gray-50 cursor-pointer group",
        isToday && "bg-blue-50 border-blue-200",
      )}
      onClick={() => onClick(date)}
      role="button"
      tabIndex={0}
      aria-label={`View appointments for ${date.toLocaleDateString()}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(date);
        }
      }}
    >
      <div
        className={cn(
          "text-sm font-medium mb-1",
          isToday ? "text-blue-600" : "text-gray-900",
        )}
      >
        {date.getDate()}
      </div>

      {hasAppointments && (
        <div className="space-y-1">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={cn(
                "text-xs px-1.5 py-0.5 rounded truncate text-white transition-colors",
                getDeliveryTypeColor(appointment.deliveryTypeId),
              )}
              title={appointment.deliveryType?.name || "Unknown Type"}
            >
              {appointment.deliveryType?.name || "Unknown Type"}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="text-xs text-gray-500 font-medium">
              +{remainingCount} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Appointment detail component
interface AppointmentDetailProps {
  appointment: AppointmentWithRelations;
}

function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "text-white",
              getDeliveryTypeColor(appointment.deliveryTypeId),
            )}
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

export function AppointmentsCalendarView({
  appointments,
}: AppointmentsCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<
    AppointmentWithRelations[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: { [key: string]: AppointmentWithRelations[] } = {};

    appointments.forEach((appointment) => {
      const appDate = new Date(appointment.date);
      const dateStr = formatDate(appDate);

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(appointment);
    });

    return grouped;
  }, [appointments]);

  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const numDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const grid: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= numDays; i++) {
      grid.push(new Date(year, month, i));
    }

    return grid;
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    const apps = appointmentsByDate[dateStr] || [];

    setSelectedDateAppointments(apps);
    setModalTitle(
      `Agendamentos para ${date.toLocaleDateString("pt-BR", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
    );
    setIsModalOpen(true);
  };

  const monthName = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          aria-label="Mês anterior"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <CardTitle className="text-lg md:text-xl font-semibold text-center">
          {monthName}
        </CardTitle>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="Próximo mês"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {/* Calendar header */}
        <div className="grid grid-cols-7 gap-px border-t border-l border-muted bg-gray-200">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-600 bg-gray-50 border-b border-r border-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px border-l border-muted bg-gray-200">
          {calendarGrid.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              appointments={
                date ? appointmentsByDate[formatDate(date)] || [] : []
              }
              isToday={date ? isToday(date) : false}
              onClick={handleDateClick}
            />
          ))}
        </div>
      </CardContent>

      {/* Appointment details modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((appointment) => (
                <AppointmentDetail
                  key={appointment.id}
                  appointment={appointment}
                />
              ))
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
    </Card>
  );
}
