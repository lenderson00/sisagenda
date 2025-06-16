"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RescheduleDialogProps {
  appointmentId: string;
  currentDate: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  reason: string;
}

interface AvailabilityResponse {
  disabledDays: number[];
  availableWeekDays: number[];
}

interface HoursResponse {
  availableTimes: string[];
  possibleTimes: string[];
}

export function RescheduleDialog({
  appointmentId,
  currentDate,
  open,
  onOpenChange,
}: RescheduleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [step, setStep] = useState<"date" | "time" | "reason">("date");
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Get appointment details for delivery type and organization
  const { data: appointment } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) throw new Error("Failed to fetch appointment");
      return response.json();
    },
    enabled: open,
  });

  // Get available days for the current month
  const { data: availability, isLoading: isLoadingDays } =
    useQuery<AvailabilityResponse>({
      queryKey: [
        "availability-days",
        appointment?.deliveryTypeId,
        appointment?.organizationId,
        currentMonth.year(),
        currentMonth.month() + 1,
      ],
      queryFn: async () => {
        const response = await fetch(
          `/api/availability/days?deliveryTypeId=${appointment.deliveryTypeId}&organizationId=${appointment.organizationId}&year=${currentMonth.year()}&month=${currentMonth.month() + 1}`,
        );
        if (!response.ok) throw new Error("Failed to fetch availability");
        return response.json();
      },
      enabled: open && !!appointment,
    });

  // Get available hours for selected date
  const { data: hours, isLoading: isLoadingHours } = useQuery<HoursResponse>({
    queryKey: [
      "availability-hours",
      appointment?.deliveryTypeId,
      appointment?.organizationId,
      selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null,
    ],
    queryFn: async () => {
      if (!selectedDate) return { availableTimes: [], possibleTimes: [] };

      const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");
      const response = await fetch(
        `/api/availability/hours?date=${dateKey}&deliveryTypeId=${appointment.deliveryTypeId}&organizationId=${appointment.organizationId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch hours");
      return response.json();
    },
    enabled: open && !!appointment && !!selectedDate && step === "time",
  });

  const isDateDisabled = (date: Date) => {
    if (!availability) return true;

    const dayjs_date = dayjs(date);
    const today = dayjs();

    // Disable past dates
    if (dayjs_date.isBefore(today, "day")) return true;

    // Disable if same as current appointment date
    if (dayjs_date.isSame(dayjs(currentDate), "day")) return true;

    // Check if day of week is available
    const weekDay = dayjs_date.day();
    if (!availability.availableWeekDays.includes(weekDay)) return true;

    // Check if specific day is disabled
    const dayOfMonth = dayjs_date.date();
    if (availability.disabledDays.includes(dayOfMonth)) return true;

    return false;
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days = [];
    let current = startDate;

    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor, selecione uma data e horário");
      return;
    }

    // Combine selected date and time
    const [hour, minute] = selectedTime.split(":").map(Number);
    const finalDateTime = dayjs(selectedDate)
      .hour(hour)
      .minute(minute)
      .toDate();

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/reschedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: data.reason,
            newDate: finalDateTime.toISOString(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to request reschedule");
      }

      // Create activity for reschedule request
      await fetch(`/api/appointments/${appointmentId}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "RESCHEDULE_REQUESTED",
          content: `Solicitação de reagendamento: ${data.reason}. Nova data proposta: ${finalDateTime.toLocaleDateString("pt-BR")} às ${selectedTime}`,
        }),
      });

      toast.success("Solicitação de reagendamento enviada com sucesso!");
      handleDialogClose(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to request reschedule:", error);
      toast.error("Erro ao enviar solicitação de reagendamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setStep("date");
      setCurrentMonth(dayjs().startOf("month"));
      reset();
    }
    onOpenChange(open);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("reason");
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("date");
      setSelectedTime(undefined);
    } else if (step === "reason") {
      setStep("time");
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== "date" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            Solicitar Reagendamento
          </DialogTitle>
          <DialogDescription>
            {step === "date" && "Selecione uma nova data disponível"}
            {step === "time" && "Selecione um horário disponível"}
            {step === "reason" && "Forneça um motivo para o reagendamento"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 overflow-y-auto">
          {step === "date" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {currentMonth.format("MMMM YYYY")}
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(currentMonth.subtract(1, "month"))
                    }
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentMonth(currentMonth.add(1, "month"))
                    }
                  >
                    ›
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day) => (
                    <div key={day} className="p-2">
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.isSame(currentMonth, "month");
                  const isDisabled = isDateDisabled(day.toDate());
                  const isSelected =
                    selectedDate && day.isSame(dayjs(selectedDate), "day");

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        !isDisabled &&
                        isCurrentMonth &&
                        handleDateSelect(day.toDate())
                      }
                      disabled={isDisabled || !isCurrentMonth}
                      className={`
                        p-2 text-sm rounded-md transition-colors
                        ${isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                        ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-50"}
                        ${isSelected ? "bg-blue-500 text-white" : ""}
                        ${!isDisabled && isCurrentMonth && !isSelected ? "hover:bg-blue-50" : ""}
                      `}
                    >
                      {day.date()}
                    </button>
                  );
                })}
              </div>

              {isLoadingDays && (
                <div className="text-center py-4 text-gray-500">
                  Carregando disponibilidade...
                </div>
              )}
            </div>
          )}

          {step === "time" && selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Data selecionada: {dayjs(selectedDate).format("DD/MM/YYYY")}
                </span>
              </div>

              <Label>Horários Disponíveis</Label>

              {isLoadingHours ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  Carregando horários...
                </div>
              ) : hours?.availableTimes.length ? (
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {hours.availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`
                        p-3 text-sm border rounded-md transition-colors
                        ${
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500"
                            : "hover:bg-blue-50 border-gray-300"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  Nenhum horário disponível para esta data
                </div>
              )}
            </div>
          )}

          {step === "reason" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Nova data:{" "}
                      {selectedDate && dayjs(selectedDate).format("DD/MM/YYYY")}{" "}
                      às {selectedTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do Reagendamento</Label>
                <Textarea
                  id="reason"
                  placeholder="Explique o motivo pelo qual você precisa reagendar este agendamento..."
                  className="min-h-[100px]"
                  {...register("reason", {
                    required:
                      "Por favor, forneça um motivo para o reagendamento",
                  })}
                />
                {errors.reason && (
                  <p className="text-sm text-red-600">
                    {errors.reason.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogClose(false)}
          >
            Cancelar
          </Button>

          {step === "reason" && (
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDate || !selectedTime}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Enviando..." : "Solicitar Reagendamento"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
