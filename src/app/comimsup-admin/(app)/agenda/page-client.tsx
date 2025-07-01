"use client";

import { EmptyCard } from "@/components/empty-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { AgendamentosDataTable } from "./_table/data-table";

// Mock hook - replace with actual implementation
function useAppointments() {
  return {
    data: [],
    isPending: false,
  };
}

export function AgendamentosList() {
  const { data, isPending } = useAppointments();

  return (
    <>
      <PageHeader
        title="Agendamentos"
        subtitle="Visualize todos os agendamentos das organizações militares"
      />

      <div className="flex h-full flex-col gap-4 p-4">
        {isPending && (
          <div className="space-y-4">
            <div className="flex items-center py-4">
              <Skeleton className="h-10 w-full md:max-w-sm" />
              <Skeleton className="ml-auto h-10 w-24" />
            </div>
            <Skeleton className="h-[50vh] w-full" />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        )}

        {!isPending && data && data.length > 0 && (
          <AgendamentosDataTable data={data} />
        )}

        {!isPending && (!data || data.length === 0) && (
          <div className="flex-1 rounded-lg border border-dashed shadow-sm">
            <EmptyCard
              title="Nenhum agendamento encontrado"
              description="Não há agendamentos para exibir no momento."
              icon={IconCalendar}
            >
              <Button>
                <IconPlus />
                Criar agendamento
              </Button>
            </EmptyCard>
          </div>
        )}
      </div>
    </>
  );
}
