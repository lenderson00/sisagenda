"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2 } from "lucide-react";
import type { AvailabilityExceptionRule } from "./types";
import { minutesToTime } from "./utils";
import Link from "next/link";

interface RuleCardProps {
  rule: AvailabilityExceptionRule;
  ruleId: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function RuleCard({ rule, ruleId, onEdit, onDelete }: RuleCardProps) {
  const { dates } = rule;
  const dateCount = dates.length;
  const firstDate = dates[0] ? dayjs(dates[0].date).format("DD/MM/YYYY") : "";
  const firstTime = dates[0]
    ? `${minutesToTime(dates[0].startTime)} - ${minutesToTime(dates[0].endTime)}`
    : "";

  const renderTooltipContent = () => {
    return (
      <ul className="list-disc space-y-1 pl-4">
        {dates.map((d, i) => (
          <li key={i}>
            {dayjs(d.date).format("DD/MM/YYYY")}: {minutesToTime(d.startTime)} -{" "}
            {minutesToTime(d.endTime)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <motion.div layout>
      <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-primary/50">
        <Link
          href={`/bloqueio-de-datas/${ruleId}`}
          className="flex flex-grow flex-col"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <CardTitle className="text-base">
                {dateCount > 1 ? `${dateCount} datas` : firstDate}
              </CardTitle>
            </div>
            <CardDescription>
              {dateCount === 1
                ? firstTime
                : `A primeira é em ${firstDate} às ${firstTime}`}
              {dateCount > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 cursor-pointer font-bold text-primary">
                        (ver todas)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{renderTooltipContent()}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow text-sm text-muted-foreground">
            <p className="line-clamp-3">{rule.comment}</p>
          </CardContent>
        </Link>
        <CardFooter className="mt-auto flex justify-end gap-2 bg-muted/30 p-3">
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
