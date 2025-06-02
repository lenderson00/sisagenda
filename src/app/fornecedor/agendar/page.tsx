"use client";

import { AgendamentoForm } from "./steps/AgendamentoForm";
import { SelectDateTime } from "./steps/SelectDateTime";
import { SelectDeliveryTime } from "./steps/SelectDeliveryTime";
import { SelectOrganizacao } from "./steps/SelectOrganizacao";
import { useAgendamentoStore } from "./store/useAgendamentoStore";

export default function AgendarPage() {
  const { currentStep } = useAgendamentoStore();

  const steps = [
    { component: SelectOrganizacao, title: "Selecionar Organização" },
    { component: SelectDeliveryTime, title: "Selecionar Horário de Entrega" },
    { component: SelectDateTime, title: "Selecionar Data e Hora" },
    { component: AgendamentoForm, title: "Preencher Dados" },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  index <= currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    index < currentStep ? "bg-primary" : "bg-muted-foreground"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-center">
          {steps[currentStep].title}
        </h2>
      </div>
      <CurrentStepComponent />
    </div>
  );
}
