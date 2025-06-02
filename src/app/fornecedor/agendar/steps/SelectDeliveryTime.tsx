"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useAgendamentoStore } from "../store/useAgendamentoStore";

// Mock data - replace with actual API call
const deliveryTimes = [
  { id: "1", nome: "Manhã", horario: "08:00 - 12:00" },
  { id: "2", nome: "Tarde", horario: "13:00 - 17:00" },
  { id: "3", nome: "Noite", horario: "18:00 - 22:00" },
];

export function SelectDeliveryTime() {
  const { updateAgendamento, setStep } = useAgendamentoStore();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleNext = () => {
    if (selectedId) {
      updateAgendamento({ deliveryTimeId: selectedId });
      setStep(2);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {deliveryTimes.map((time) => (
          <Card
            key={time.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedId === time.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleSelect(time.id)}
          >
            <h3 className="font-semibold">{time.nome}</h3>
            <p className="text-sm text-muted-foreground">{time.horario}</p>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="w-full" onClick={() => setStep(0)}>
          Voltar
        </Button>
        <Button className="w-full" onClick={handleNext} disabled={!selectedId}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
