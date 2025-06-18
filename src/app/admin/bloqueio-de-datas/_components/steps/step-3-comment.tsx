"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar, Clock } from "lucide-react";
import { StepTitle } from "../step-title";
import type { AvailabilityExceptionRule } from "../types";

interface Step3CommentProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  rule: AvailabilityExceptionRule;
}

export function Step3Comment({
  comment,
  onCommentChange,
  rule,
}: Step3CommentProps) {
  const { dates } = rule;
  const dateCount = dates.length;

  return (
    <>
      <StepTitle
        title="Adicionar Justificativa"
        description="Forneça um motivo para a criação desta regra de bloqueio."
      />

      <div className="space-y-4">
        <div className="p-4 rounded-lg border space-y-3">
          <h4 className="text-sm font-medium ">Resumo da Regra</h4>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg flex items-center justify-center bg-primary-foreground text-primary",
              )}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium ">
              {dateCount}{" "}
              {dateCount === 1 ? "data selecionada" : "datas selecionadas"}
            </span>
          </div>
          {dates.slice(0, 3).map((d, i) => (
            <div key={i} className="flex items-center gap-3 pl-10 text-xs ">
              <span className="font-mono">
                {dayjs(d.date).format("DD/MM/YYYY")}
              </span>
              <span>
                das{" "}
                {dayjs()
                  .startOf("day")
                  .add(d.startTime, "minute")
                  .format("HH:mm")}{" "}
                às{" "}
                {dayjs()
                  .startOf("day")
                  .add(d.endTime, "minute")
                  .format("HH:mm")}
              </span>
            </div>
          ))}
          {dateCount > 3 && (
            <p className="pl-10 text-xs ">... e mais {dateCount - 3}.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium ">
            Justificativa *
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Ex: Feriado nacional, Reunião da equipe, etc."
            className="min-h-[120px] text-sm"
          />
          {!comment.trim() && (
            <p className="text-xs text-destructive">
              A justificativa é obrigatória.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
