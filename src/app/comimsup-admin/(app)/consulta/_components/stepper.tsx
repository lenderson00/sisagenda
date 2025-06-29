"use client";

import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

type StepStatus = "complete" | "current" | "upcoming";

interface Step {
  id: string;
  name: string;
  status: StepStatus;
}

interface StepperProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function Stepper({ steps, onStepClick, className }: StepperProps) {
  const canClick = (step: Step) => onStepClick && step.status === "complete";

  return (
    <nav aria-label="Progress">
      <div
        className={cn(
          "flex items-center border-y border-border divide-x divide-border",
          className,
        )}
      >
        {steps.map((step, stepIdx) => (
          <div key={step.name} className="relative flex-1 flex">
            <button
              type="button"
              onClick={() => canClick(step) && onStepClick?.(step.id)}
              className={cn(
                "group flex items-center justify-center w-full p-4 text-sm font-medium transition-colors",
                canClick(step)
                  ? "cursor-pointer hover:bg-muted/50"
                  : "cursor-default",
              )}
              disabled={!canClick(step)}
              aria-current={step.status === "current" ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  {
                    "bg-primary border-primary": step.status === "complete",
                    "border-primary": step.status === "current",
                    "border-border group-hover:border-muted-foreground/50":
                      step.status === "upcoming",
                  },
                )}
              >
                {step.status === "complete" ? (
                  <IconCheck
                    className="h-5 w-5 text-primary-foreground"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={cn("transition-colors", {
                      "text-primary": step.status === "current",
                      "text-muted-foreground group-hover:text-emphasis/80":
                        step.status === "upcoming",
                    })}
                  >
                    {stepIdx + 1}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "ml-3 hidden text-sm font-medium transition-colors md:block",
                  {
                    "text-primary": step.status === "current",
                    "text-emphasis": step.status === "complete",
                    "text-muted-foreground group-hover:text-emphasis/80":
                      step.status === "upcoming",
                  },
                )}
              >
                {step.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}
