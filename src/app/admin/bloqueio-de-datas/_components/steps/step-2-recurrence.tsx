"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { recurrenceOptions } from "../constants";
import { StepTitle } from "../step-title";
import type { RecurrenceType } from "../types";

interface Step2RecurrenceProps {
  recurrenceType: RecurrenceType;
  onRecurrenceTypeChange: (type: RecurrenceType) => void;
}

export function Step2Recurrence({
  recurrenceType,
  onRecurrenceTypeChange,
}: Step2RecurrenceProps) {
  return (
    <>
      <StepTitle
        title="Defina a Recorrência"
        description="Escolha se a regra será aplicada uma única vez ou de forma recorrente"
      />
      <div className="grid grid-cols-1 gap-3">
        {recurrenceOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.value}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                recurrenceType === option.value
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 hover:border-slate-300 bg-white",
              )}
              onClick={() =>
                onRecurrenceTypeChange(option.value as RecurrenceType)
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    recurrenceType === option.value
                      ? option.value === "ONE_TIME"
                        ? "bg-teal-100"
                        : "bg-purple-100"
                      : "bg-slate-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      recurrenceType === option.value
                        ? option.value === "ONE_TIME"
                          ? "text-teal-600"
                          : "text-purple-600"
                        : "text-slate-600",
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-slate-900">
                    {option.label}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {option.description}
                  </p>
                </div>
                {recurrenceType === option.value && (
                  <CheckCircle2 className="w-5 h-5 text-sky-600" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
