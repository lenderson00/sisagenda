"use client";

import { Calendar } from "@/components/calendar";
import { TimePicker } from "@/components/calendar/time-picker";
import { MeetingInfo } from "@/components/calendar/metting-info";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { cn } from "@/lib/utils";

dayjs.locale("pt-br");

export default function DemoCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const username = "testuser";

  const isDateSelected = selectedDate !== null;

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-700">
          Agendamento de Reunião
        </h1>

        {/* Three-column layout */}
        <div className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] xl:grid-cols-[320px_1fr_340px] min-h-[600px]">
            {/* Meeting Info - Left Column */}
            <div className="border-r border-slate-200 bg-slate-50/30">
              <MeetingInfo
                profileName="Antoine Milkoff"
                meetingTitle="30 Min Meeting"
                duration={30}
                videoEnabled={true}
                timezone="America/Martinique"
              />
            </div>

            {/* Calendar - Center Column */}
            <div className="relative">
              <Calendar
                username={username}
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
                    username={username}
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

        {/* Responsive Mobile Layout */}
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
    </div>
  );
}
