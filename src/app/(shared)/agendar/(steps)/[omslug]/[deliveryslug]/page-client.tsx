"use client";

import { useState } from "react";
import { Calendar } from "@/components/calendar";
import { TimePicker } from "@/components/calendar/time-picker";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useScheduleStore } from "./_store";

export function DataPageClient({
  organizationId,
  deliveryTypeId,
}: {
  organizationId: string;
  deliveryTypeId: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { setSchedule } = useScheduleStore();
  const router = useRouter();

  const isDateSelected = selectedDate !== null;

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelected = (time: Date) => {
    setSchedule({
      organizationId,
      deliveryTypeId,
      dateTime: time,
      lastUpdated: Date.now(),
    });
    router.push(`/agendar/${organizationId}/${deliveryTypeId}/informacoes`);
  };

  return (
    <div className=" bg-background rounded-lg border overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_350px] ">
      {/* Calendar - Left Column */}
      <div className="relative">
        <Calendar
          organizationId={organizationId}
          deliveryTypeId={deliveryTypeId}
          selectedDate={selectedDate}
          onDateSelected={handleDateSelected}
        />
      </div>

      {/* Time Picker - Right Column */}
      <div className="relative border-l ">
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 ease-in-out",
            isDateSelected
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none",
          )}
        >
          {selectedDate && (
            <TimePicker
              key={selectedDate.toISOString()}
              selectedDate={selectedDate}
              deliveryTypeId={deliveryTypeId}
              organizationId={organizationId}
              onTimeSelected={handleTimeSelected}
            />
          )}
        </div>

        {/* Placeholder content when no date is selected */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
            isDateSelected
              ? "opacity-0 translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0",
          )}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full  flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-bold text-lg">Nenhuma data selecionada</p>
            <p className="text-muted-foreground text-sm mt-1">
              Selecione uma data para ver os horários disponíveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
