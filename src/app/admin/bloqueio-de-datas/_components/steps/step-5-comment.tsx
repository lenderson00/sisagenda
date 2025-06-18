"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarX, MessageSquare, Repeat } from "lucide-react";
import { ruleTypeOptions } from "../constants";
import { StepTitle } from "../step-title";
import type { AvailabilityExceptionRule } from "../types";

interface Step5CommentProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  rule: AvailabilityExceptionRule;
}

export function Step5Comment({
  comment,
  onCommentChange,
  rule,
}: Step5CommentProps) {
  const selectedRuleType = ruleTypeOptions.find(
    (option) => option.value === rule.type,
  );

  const getRuleSummary = () => {
    switch (rule.type) {
      case "BLOCK_WHOLE_DAY":
        return "Bloquear todo o dia";
      case "BLOCK_TIME_RANGE":
        return "Bloquear um intervalo de tempo";
      case "BLOCK_SPECIFIC_WEEK_DAYS":
        return "Bloquear dias específicos da semana";
      default:
        return "Regra desconhecida";
    }
  };

  return (
    <>
      <StepTitle
        title="Adicione uma Justificativa"
        description="Explique o motivo deste bloqueio para referência futura"
      />
      <div className="space-y-5">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-amber-800 mb-1">
                Justificativa Obrigatória
              </h4>
              <p className="text-xs text-amber-700">
                Adicione uma justificativa clara para este bloqueio. Isso
                ajudará a entender o motivo no futuro e facilita auditorias.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="comment"
            className="text-sm font-medium text-slate-700"
          >
            Motivo / Justificativa *
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Ex: Feriado nacional, Reunião importante, Manutenção do sistema, Compromisso pessoal, etc."
            className="min-h-[120px] text-sm"
          />
          {!comment.trim() && (
            <p className="text-xs text-red-600">
              Justificativa é obrigatória para criar a regra.
            </p>
          )}
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h4 className="font-medium text-sm text-slate-800">
            Resumo da Regra
          </h4>

          <div className="flex items-center gap-2">
            {selectedRuleType && (
              <div
                className={cn(
                  "p-1.5 rounded",
                  rule.type === "BLOCK_WHOLE_DAY"
                    ? "bg-red-100 text-red-700"
                    : rule.type === "BLOCK_TIME_RANGE"
                      ? "bg-orange-100 text-orange-700"
                      : rule.type === "BLOCK_SPECIFIC_WEEK_DAYS"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-indigo-100 text-indigo-700",
                )}
              >
                <selectedRuleType.icon className="w-3 h-3" />
              </div>
            )}
            <span className="text-sm font-medium text-slate-700">
              {getRuleSummary()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {rule.recurrence === "RECURRING" ? (
              <Repeat className="w-3 h-3 text-purple-600" />
            ) : (
              <CalendarX className="w-3 h-3 text-teal-600" />
            )}
            <span className="text-sm text-slate-700">
              {rule.recurrence === "RECURRING" ? "Recorrente" : "Uma vez"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
