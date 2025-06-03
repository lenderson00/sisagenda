"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

interface AppointmentsCalendarViewProps {
  appointments: AppointmentWithRelations[];
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
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
  const month = currentDate.getMonth(); // 0-11

  const appointmentsByDate = useMemo(() => {
    const grouped: { [key: string]: AppointmentWithRelations[] } = {};
    for (const app of appointments) {
      const appDate = new Date(app.date);
      // Ensure we are comparing dates in the same timezone context (local)
      const appDateStr = new Date(
        appDate.getFullYear(),
        appDate.getMonth(),
        appDate.getDate(),
      )
        .toISOString()
        .split("T")[0];
      if (!grouped[appDateStr]) {
        grouped[appDateStr] = [];
      }
      grouped[appDateStr].push(app);
    }
    return grouped;
  }, [appointments]);

  const calendarGrid = useMemo(() => {
    const numDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const grid: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      grid.push(null); // Empty cells before the first day
    }
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
    const dateStr = date.toISOString().split("T")[0];
    const apps = appointmentsByDate[dateStr] || [];
    setSelectedDateAppointments(apps);
    setModalTitle(
      `Agendamentos para ${date.toLocaleDateString("pt-BR", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
    );
    setIsModalOpen(true);
  };

  const getStatusColor = (deliveryTypeId: string) => {
    switch (deliveryTypeId) {
      case "1":
        return "bg-blue-500";
      case "2":
        return "bg-green-500";
      case "3":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-xl font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px border-t border-l border-gray-200 bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500 bg-gray-50 border-b border-r border-gray-200"
            >
              {day}
            </div>
          ))}
          {calendarGrid.map((date, index) => {
            const isToday =
              date && date.toDateString() === new Date().toDateString();
            const dateStr = date ? date.toISOString().split("T")[0] : "";
            const dailyAppointments = date
              ? appointmentsByDate[dateStr] || []
              : [];

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-2 bg-white border-b border-r border-gray-200 relative",
                  date ? "cursor-pointer hover:bg-gray-50" : "bg-gray-50",
                  isToday && "bg-blue-50",
                )}
                onClick={() => date && handleDateClick(date)}
                role={date ? "button" : undefined}
                tabIndex={date ? 0 : -1}
                aria-label={
                  date
                    ? `View appointments for ${date.toLocaleDateString()}`
                    : undefined
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    date && handleDateClick(date);
                  }
                }}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium text-gray-900">
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dailyAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded truncate",
                            getStatusColor(appointment.deliveryTypeId),
                            "text-white",
                          )}
                        >
                          {appointment.deliveryType?.name || "Unknown Type"}
                        </div>
                      ))}
                      {dailyAppointments.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dailyAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDateAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {appointment.deliveryType?.name || "Unknown Type"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.date.toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    User: {appointment.userId}
                  </div>
                  {appointment.observations && (
                    <div className="text-sm text-gray-600">
                      {JSON.stringify(appointment.observations)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {selectedDateAppointments.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nenhum agendamento agendado para esta data.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
