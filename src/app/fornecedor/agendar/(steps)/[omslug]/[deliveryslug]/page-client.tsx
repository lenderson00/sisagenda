"use client";

import { Calendar } from "@/components/calendar";
import { MeetingInfo } from "@/components/calendar/metting-info";
import { TimePicker } from "@/components/calendar/time-picker";
import dayjs from "dayjs";
import { useState } from "react";
import "dayjs/locale/pt-br";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useScheduleStore } from "./_store";

dayjs.locale("pt-br");

export function DataPageClient({
  organizationId,
  deliveryTypeId,
  organizationName = "Organização",
}: {
  organizationId: string;
  deliveryTypeId: string;
  organizationName?: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "rules">("weekly");
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
    });
    router.push(`/agendar/${organizationId}/${deliveryTypeId}/informacoes`);
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      {/* Three-column layout */}
      <div className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_420px] xl:grid-cols-[320px_1fr_440px] min-h-[600px]">
          {/* Meeting Info - Left Column */}
          <div className="border-r border-slate-200 bg-slate-50/30">
            <MeetingInfo profileName="Antoine Milkoff" duration={30} />
          </div>

          {/* Calendar - Center Column */}
          <div className="relative">
            <Calendar
              organizationId={organizationId}
              deliveryTypeId={deliveryTypeId}
              selectedDate={selectedDate}
              onDateSelected={handleDateSelected}
            />
          </div>

          {/* Time Picker - Right Column */}
          <div className="relative border-l border-slate-200 bg-slate-50/30">
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-slate-400"
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
                <p className="text-slate-500 text-sm font-medium">
                  Selecione uma data
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  para ver os horários disponíveis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-medium text-slate-900 mb-2">
            Informações da Reunião
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Organizador:</span>
              <p className="font-medium">Antoine Milkoff</p>
            </div>
            <div>
              <span className="text-slate-500">Duração:</span>
              <p className="font-medium">30 minutos</p>
            </div>
            <div>
              <span className="text-slate-500">Tipo:</span>
              <p className="font-medium">Videochamada</p>
            </div>
            <div>
              <span className="text-slate-500">Fuso:</span>
              <p className="font-medium">Martinique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
