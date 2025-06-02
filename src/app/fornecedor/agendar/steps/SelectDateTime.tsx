"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useAgendamentoStore } from "../store/useAgendamentoStore";

// Mock data - replace with actual API call
const horariosDisponiveis = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function SelectDateTime() {
  const { updateAgendamento, setStep } = useAgendamentoStore();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      updateAgendamento({
        data: selectedDate,
        hora: selectedTime,
      });
      setStep(3);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Selecione a data</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <h3 className="font-semibold">Selecione o horário</h3>
          <div className="grid grid-cols-3 gap-2">
            {horariosDisponiveis.map((horario) => (
              <Button
                key={horario}
                variant={selectedTime === horario ? "default" : "outline"}
                onClick={() => setSelectedTime(horario)}
                className="w-full"
              >
                {horario}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
          Voltar
        </Button>
        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
