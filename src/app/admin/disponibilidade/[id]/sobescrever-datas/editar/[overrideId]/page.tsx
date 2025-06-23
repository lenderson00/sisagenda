"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  OverrideForm,
  type OverrideFormValues,
} from "../../_components/override-form";
import type { DateOverride } from "../../page-client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function EditOverridePage() {
  const { id: scheduleId, overrideId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: allOverrides, isLoading: isLoadingAll } = useQuery<
    DateOverride[]
  >({
    queryKey: ["availability-rules", scheduleId],
    queryFn: async () => {
      if (!scheduleId) return [];
      const response = await fetch(`/api/rules?scheduleId=${scheduleId}`);
      if (!response.ok) throw new Error("Failed to fetch rules");
      return response.json();
    },
    enabled: !!scheduleId,
  });

  const { data: editingOverride, isLoading: isLoadingSingle } =
    useQuery<DateOverride>({
      queryKey: ["availability-rule", overrideId],
      queryFn: async () => {
        if (!overrideId) throw new Error("No override ID");
        const response = await fetch(
          `/api/rules?availabilityRuleId=${overrideId}&scheduleId=${scheduleId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch rule");
        return response.json();
      },
      enabled: !!overrideId,
    });

  const updateMutation = useMutation({
    mutationFn: async (overrideToUpdate: OverrideFormValues) => {
      if (!overrideId) throw new Error("No override to update");
      const response = await fetch("/api/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...overrideToUpdate,
          availabilityRuleId: overrideId,
          scheduleId,
        }),
      });
      if (!response.ok) throw new Error("Failed to update rule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rules", scheduleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["availability-rule", overrideId],
      });
      toast.success("Substituição atualizada com sucesso!");
      router.back();
    },
    onError: () => {
      toast.error("Falha ao atualizar a substituição.");
    },
  });

  if (isLoadingAll || isLoadingSingle) return <div>Carregando...</div>;
  if (!editingOverride) return <div>Substituição não encontrada.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Editar substituição"
        subtitle="Ajuste os horários para a data selecionada."
      >
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </PageHeader>
      <div className="mt-8">
        <OverrideForm
          onSave={(values) => updateMutation.mutate(values[0])}
          scheduleId={scheduleId as string}
          existingOverrides={allOverrides || []}
          initialData={editingOverride}
        />
      </div>
    </div>
  );
}
