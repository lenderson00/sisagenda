"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useAgendamentoStore } from "../store/useAgendamentoStore";

// Mock data - replace with actual API call
const organizacoes = [
  { id: "1", nome: "Organização A", endereco: "Rua A, 123" },
  { id: "2", nome: "Organização B", endereco: "Rua B, 456" },
  { id: "3", nome: "Organização C", endereco: "Rua C, 789" },
];

export function SelectOrganizacao() {
  const { updateAgendamento, setStep } = useAgendamentoStore();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleNext = () => {
    if (selectedId) {
      updateAgendamento({ organizacaoId: selectedId });
      setStep(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {organizacoes.map((org) => (
          <Card
            key={org.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedId === org.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleSelect(org.id)}
          >
            <h3 className="font-semibold">{org.nome}</h3>
            <p className="text-sm text-muted-foreground">{org.endereco}</p>
          </Card>
        ))}
      </div>
      <Button className="w-full" onClick={handleNext} disabled={!selectedId}>
        Continuar
      </Button>
    </div>
  );
}
