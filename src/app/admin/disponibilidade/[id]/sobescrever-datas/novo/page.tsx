"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  OverrideForm,
  type OverrideFormValues,
} from "../_components/override-form";
import type { DateOverride } from "../page-client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function NewOverridePage() {
  const { id: scheduleId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: overrides, isLoading } = useQuery<DateOverride[]>({
    queryKey: ["availability-rules", scheduleId],
    queryFn: async () => {
      if (!scheduleId) return [];
      const response = await fetch(`/api/rules?scheduleId=${scheduleId}`);
      if (!response.ok) throw new Error("Failed to fetch rules");
      return response.json();
    },
    enabled: !!scheduleId,
  });

  const createMutation = useMutation({
    mutationFn: async (newOverrides: OverrideFormValues[]) => {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: newOverrides, scheduleId }),
      });
      if (!response.ok) throw new Error("Failed to create rules");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rules", scheduleId],
      });
      toast.success("Substituições criadas com sucesso!");
      router.back();
    },
    onError: () => {
      toast.error("Falha ao criar as substituições.");
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Adicionar nova substituição"
        subtitle="Selecione as datas e horários para substituir a disponibilidade padrão."
      >
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </PageHeader>
      <div className="mt-8">
        <OverrideForm
          onSave={(values) => createMutation.mutate(values)}
          scheduleId={scheduleId as string}
          existingOverrides={overrides || []}
        />
      </div>
    </div>
  );
}
