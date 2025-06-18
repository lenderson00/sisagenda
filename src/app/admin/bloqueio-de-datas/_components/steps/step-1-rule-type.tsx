"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ruleTypeOptions } from "../constants";
import { StepTitle } from "../step-title";

interface Step1RuleTypeProps {
  ruleType: string;
  onRuleTypeChange: (type: string) => void;
}

export function Step1RuleType({
  ruleType,
  onRuleTypeChange,
}: Step1RuleTypeProps) {
  return (
    <>
      <StepTitle
        title="Selecione o Tipo de Regra"
        description="Escolha o tipo de bloqueio que deseja criar"
      />
      <div className="grid grid-cols-1 gap-3">
        {ruleTypeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.value}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                ruleType === option.value
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 hover:border-slate-300 bg-white",
              )}
              onClick={() => onRuleTypeChange(option.value)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    ruleType === option.value ? "bg-sky-100" : "bg-slate-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      ruleType === option.value
                        ? "text-sky-600"
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
                {ruleType === option.value && (
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
