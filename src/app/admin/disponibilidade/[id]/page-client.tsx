"use client";

import { useParams } from "next/navigation";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSchedule } from "./_hooks/use-schedule";

export function SchedulePageClient() {
  const params = useParams();
  const scheduleId = params.id as string;

  const { data: schedule, isLoading } = useSchedule(scheduleId);

  console.log(schedule);

  return (
    <>
      <div>
        <h1>Disponibilidade</h1>
      </div>
      <div className="flex gap-4 justify-between mt-12">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-lg font-bold">Sobescrever Datas Disponíveis</h2>
          <p className="text-sm text-muted-foreground max-w-sm text-balance">
            Sobescreva as datas disponíveis para o usuário. Essas datas serão
            exibidas no calendário de disponibilidade do usuário.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <IconPlus className="w-4 h-4" />
            Adicionar Datas
          </Button>
        </div>
      </div>
      <div className="mt-12">Lista das datas sobrescritas</div>
    </>
  );
}
