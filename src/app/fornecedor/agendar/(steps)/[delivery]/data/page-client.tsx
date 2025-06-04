"use client";

import { Calendar } from "@/components/calendar";
import { MeetingInfo } from "@/components/calendar/metting-info";
import { TimePicker } from "@/components/calendar/time-picker";
import dayjs from "dayjs";
import { useState } from "react";
import "dayjs/locale/pt-br";

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

  const isDateSelected = selectedDate !== null;

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
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
              username={organizationName}
              selectedDate={selectedDate}
              onDateSelected={handleDateSelected}
            />
          </div>

          {/* Right Column: Tabs for Weekly and Rules */}
          <div className="relative border-l border-slate-200 bg-slate-50/30 p-4">
            <div className="flex mb-4 gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded font-medium ${activeTab === "weekly" ? "bg-slate-200" : "bg-white border"}`}
                onClick={() => setActiveTab("weekly")}
              >
                Horários Semanais
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded font-medium ${activeTab === "rules" ? "bg-slate-200" : "bg-white border"}`}
                onClick={() => setActiveTab("rules")}
              >
                Regras Avançadas
              </button>
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
  );
}
