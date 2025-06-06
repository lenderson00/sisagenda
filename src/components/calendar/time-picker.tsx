"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ArrowRight, CalendarIcon, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDateStore } from "@/hooks/use-selected-date";

interface TimePickerProps {
  selectedDate: Date;
  organizationId: string;
  deliveryTypeId: string;
}

export function TimePicker({
  selectedDate,
  organizationId,
  deliveryTypeId,
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");
  const weekDay = dayjs(selectedDate).format("dddd");
  const describedDate = dayjs(selectedDate).format("DD[ de ]MMMM");
  const router = useRouter();
  const { setDate } = useDateStore();
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleSelectTime = (hour: number) => {
    setSelectedTime(hour);
  };

  const handleContinue = () => {
    if (selectedTime) {
      setDate(dayjs(selectedDate).hour(selectedTime).toDate()); // Store the selected date with time
      router.push(`/agendar/${organizationId}/${deliveryTypeId}/informacoes`);
      toast.success(
        `Horário ${String(selectedTime).padStart(2, "0")}:00 selecionado`,
      );
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-100">
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">
                  Horários disponíveis
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {availability.availableTimes.length} de{" "}
                  {availability.possibleTimes.length}
                </span>
              </div>

              <div className="space-y-2">
                {availability.possibleTimes.map((hour: any, index: any) => {
                  const isAvailable =
                    availability.availableTimes.includes(hour);
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
                        "w-full p-3 text-sm font-medium rounded-lg transition-all duration-200",
                        "border text-left group relative overflow-hidden",
                        "focus:outline-none focus:ring-2 focus:ring-offset-1",
                        // Available states
                        isAvailable &&
                          !isSelected &&
                          "bg-white hover:bg-slate-50 text-slate-900 cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow-sm focus:ring-sky-500",
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
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full transition-colors",
                              isSelected
                                ? "bg-white"
                                : isAvailable
                                  ? "bg-green-500"
                                  : "bg-slate-300",
                            )}
                          />
                          <span className="font-mono">
                            {String(hour).padStart(2, "0")}:00
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                Selecionado
                              </span>
                            </motion.div>
                          )}

                          {!isSelected && (
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium transition-colors",
                                isAvailable
                                  ? "text-green-700 bg-green-50"
                                  : "text-slate-500 bg-slate-100",
                              )}
                            >
                              {isAvailable ? "Disponível" : "Ocupado"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover effect background for available slots */}
                      {isAvailable && !isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}

                      {/* Selected state background animation */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {availability.availableTimes.length === 0 && (
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
          className="flex-shrink-0 border-t border-slate-100 p-6"
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
                "w-full h-12 text-sm font-medium transition-all duration-200",
                "flex items-center justify-center gap-2",
                selectedTime
                  ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg"
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
