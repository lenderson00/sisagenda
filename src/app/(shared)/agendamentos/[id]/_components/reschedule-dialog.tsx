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
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";
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
  onFormSubmit?: (payload: { newDate: string; reason?: string }) => void;
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

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function RescheduleDialog({
  appointmentId,
  currentDate,
  open,
  onOpenChange,
  onFormSubmit,
}: RescheduleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [step, setStep] = useState<"date" | "time" | "reason">("date");
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const router = useRouter();
  const queryClient = useQueryClient();
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

    if (onFormSubmit) {
      onFormSubmit({
        newDate: finalDateTime.toISOString(),
        reason: data.reason,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/action`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "request_reschedule",
            payload: {
              reason: data.reason,
              newDate: finalDateTime.toISOString(),
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Solicitação de reagendamento enviada com sucesso!");

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["appointment-activities", appointmentId],
      });

      handleDialogClose(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to request reschedule:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao enviar solicitação de reagendamento",
      );
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
                <h3 className="text-lg font-medium capitalize">
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
                {weekDays.map((day) => (
                  <div key={day} className="p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.isSame(currentMonth, "month");
                  const isDisabled = isDateDisabled(day.toDate());
                  const isSelected =
                    selectedDate && day.isSame(dayjs(selectedDate), "day");
                  const isToday = day.isSame(dayjs(), "day");

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
                      className={cn(
                        "p-2 text-sm rounded-md transition-colors relative",
                        // Base styles
                        isCurrentMonth ? "text-gray-900" : "text-gray-300",
                        // Disabled state
                        isDisabled || !isCurrentMonth
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-blue-50 cursor-pointer",
                        // Selected state
                        isSelected &&
                          "bg-blue-500 text-white hover:bg-blue-600",
                        // Today indicator
                        isToday && !isSelected && "bg-gray-100 font-semibold",
                        // Available dates
                        !isDisabled &&
                          isCurrentMonth &&
                          !isSelected &&
                          "hover:bg-blue-50",
                      )}
                    >
                      {day.date()}
                      {isToday && !isSelected && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isLoadingDays && (
                <div className="text-center py-4 text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2" />
                  Carregando disponibilidade...
                </div>
              )}

              {availability && !isLoadingDays && (
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>
                    Dias disponíveis:{" "}
                    {availability.availableWeekDays
                      .map((day) => weekDays[day])
                      .join(", ")}
                  </p>
                  {availability.disabledDays.length > 0 && (
                    <p>
                      Dias indisponíveis no mês:{" "}
                      {availability.disabledDays.slice(0, 10).join(", ")}
                      {availability.disabledDays.length > 10 && "..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === "time" && selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span>
                  Data selecionada:{" "}
                  <span className="font-medium">
                    {dayjs(selectedDate).format("dddd, DD [de] MMMM [de] YYYY")}
                  </span>
                </span>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Horários Disponíveis
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione um horário para o reagendamento
                </p>
              </div>

              {isLoadingHours ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
                  <p>Carregando horários disponíveis...</p>
                </div>
              ) : hours?.availableTimes.length ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {hours.availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={cn(
                          "p-3 text-sm border rounded-md transition-all duration-200 font-medium",
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500 shadow-md"
                            : "hover:bg-blue-50 border-muted hover:border-blue-300 hover:shadow-sm",
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {hours.availableTimes.length} horário
                    {hours.availableTimes.length !== 1 ? "s" : ""} disponível
                    {hours.availableTimes.length !== 1 ? "is" : ""}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">
                    Nenhum horário disponível para esta data
                  </p>
                  <p className="text-sm mt-1">
                    Tente selecionar uma data diferente
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "reason" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Resumo do Reagendamento
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Nova data:{" "}
                        <span className="font-medium">
                          {selectedDate &&
                            dayjs(selectedDate).format("DD/MM/YYYY")}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Horário:{" "}
                        <span className="font-medium">{selectedTime}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-base font-medium">
                  Motivo do Reagendamento *
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Explique o motivo pelo qual você precisa reagendar este agendamento..."
                  className="min-h-[100px] resize-none"
                  {...register("reason", {
                    required:
                      "Por favor, forneça um motivo para o reagendamento",
                    minLength: {
                      value: 10,
                      message: "O motivo deve ter pelo menos 10 caracteres",
                    },
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Enviando..." : "Solicitar Reagendamento"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
