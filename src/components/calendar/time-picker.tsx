"use client";

import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/hooks/use-selected-date";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ArrowRight, CalendarIcon, Check, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TimePickerProps {
  selectedDate: Date;
  organizationId: string;
  deliveryTypeId: string;
  onTimeSelected: (time: Date) => void;
}

export function TimePicker({
  selectedDate,
  organizationId,
  deliveryTypeId,
  onTimeSelected,
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");
  const weekDay = dayjs(selectedDate).format("dddd");
  const describedDate = dayjs(selectedDate).format("DD[ de ]MMMM");
  const router = useRouter();
  const { setDate } = useScheduleStore();
  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime(null);
  }, []); // dateKey changes when selectedDate changes

  const { data: availability, isLoading } = useQuery({
    queryKey: ["availability", organizationId, dateKey],
    queryFn: async () => {
      // TODO: Replace with actual API call
      const response = await fetch(
        `/api/availability/hours?date=${dateKey}&deliveryTypeId=${deliveryTypeId}&organizationId=${organizationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.json();
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: true,
  });

  const handleSelectTime = (hour: string) => {
    setSelectedTime(hour);
  };

  const handleContinue = () => {
    if (selectedTime) {
      const [hour, minute] = selectedTime.split(":").map(Number);
      const date = new Date(selectedDate);
      date.setHours(hour, minute, 0, 0);
      onTimeSelected(date);
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-background">
        <motion.div
          key={dateKey} // Re-animate when date changes
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 justify-between"
        >
          <p className="font-medium text-slate-900 capitalize">{weekDay}</p>
          <p className="text-sm text-slate-500">{describedDate}</p>
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key={`loading-${dateKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full"
              />
              <p className="ml-3 text-slate-500 text-sm">Carregando...</p>
            </motion.div>
          )}

          {/* No Availability */}
          {!isLoading && !availability && (
            <motion.div
              key={`no-availability-${dateKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Sem horários</p>
              <p className="text-slate-400 text-xs mt-1">
                Nenhum horário disponível
              </p>
            </motion.div>
          )}

          {/* Time Slots */}
          {!isLoading && availability && (
            <motion.div
              key={`availability-${dateKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">
                  Horários disponíveis
                </h3>
                {availability?.availableTimes && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {availability.availableTimes.length} de{" "}
                    {availability.possibleTimes.length}
                  </span>
                )}
              </div> */}

              <div className="space-y-2">
                {availability?.possibleTimes?.map((hour: any, index: any) => {
                  const isAvailable =
                    availability.availableTimes?.includes(hour) ?? false;
                  const isSelected = selectedTime === hour;

                  return (
                    <motion.button
                      key={`${dateKey}-${hour}`} // Include dateKey to force re-render
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() => isAvailable && handleSelectTime(hour)}
                      disabled={!isAvailable}
                      className={cn(
                        "w-full px-3 py-1 text-sm font-medium rounded transition-all duration-200",
                        "border text-left group relative overflow-hidden",
                        "focus:outline-none focus:ring-2 focus:ring-offset-1",
                        // Available states
                        isAvailable &&
                          !isSelected &&
                          "bg-white hover:bg-slate-50 text-slate-900 cursor-pointer border-slate-200 hover:border-slate-300  focus:ring-sky-500",
                        // Selected state
                        isSelected &&
                          "bg-sky-500 text-white border-sky-500 shadow-md focus:ring-sky-400",
                        // Disabled state
                        !isAvailable &&
                          "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100",
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{hour}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-1"
                            >
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  isAvailable
                                    ? isSelected
                                      ? "text-white"
                                      : "text-green-500"
                                    : null,
                                )}
                              >
                                {isAvailable
                                  ? isSelected
                                    ? "Selecionado"
                                    : "Disponível"
                                  : "Ocupado"}
                              </span>
                            </motion.div>
                          }
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {availability?.availableTimes?.length === 0 && (
                <div className="text-center py-6 border-t border-slate-100 mt-6">
                  <p className="text-sm text-slate-500">
                    Todos os horários estão ocupados
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tente outra data
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Footer with Continue Button */}
      {!isLoading && availability && availability.availableTimes.length > 0 && (
        <motion.div
          key={`footer-${dateKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-shrink-0 border-t border-slate-100 p-2 mx-4"
        >
          <motion.div
            animate={{
              opacity: selectedTime ? 1 : 0.5,
              scale: selectedTime ? 1 : 0.98,
            }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedTime}
              className={cn(
                "w-full h-8 text-sm font-medium transition-all duration-200",
                "flex items-center justify-center gap-2",
                selectedTime
                  ? "bg-sky-500 hover:bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed",
              )}
            >
              {selectedTime ? (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <span>Selecione um horário</span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
