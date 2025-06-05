import { cn } from "@/lib/utils";
import React from "react";

type StepperProps = {
  step: number;
  totalSteps: number;
};

export const Stepper = ({ step, totalSteps }: StepperProps) => {
  return (
    <div className="w-full">
      <div className="mb-1 text-xs text-gray-600" aria-live="polite">
        Passo {step} de {totalSteps}
      </div>
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        tabIndex={0}
      >
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isActive = idx + 1 === step;
          const isCompleted = idx + 1 < step;
          return (
            <React.Fragment key={`step-${idx + 1}`}>
              <div
                className={cn(
                  "w-full h-1 rounded-full transition-colors duration-200",
                  "bg-neutral-400",
                  isActive && "bg-primary",
                  isCompleted && "bg-primary",
                )}
                aria-label={`Step ${idx + 1}`}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
