"use client";

import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-foreground">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-1.5" />
    </div>
  );
}
