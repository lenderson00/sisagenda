"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  OverrideForm,
  type OverrideFormValues,
} from "./_components/override-form";
import type { AvailabilityRule } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

dayjs.locale("pt-br");

// This interface should reflect the data structure received from the API
export type DateOverride = AvailabilityRule;

const minutesToTime = (minutes: number | null) => {
  if (minutes === null) return "";
  return dayjs().startOf("day").add(minutes, "minute").format("HH:mm");
};

export default function PageClient() {
  const { id: scheduleId } = useParams();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<DateOverride | null>(
    null,
  );

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

  const futureOverrides = useMemo(() => {
    const yesterday = dayjs().subtract(1, "day").endOf("day");
    return (overrides || [])
      .filter(
        (override) => override.date && dayjs(override.date).isAfter(yesterday),
      )
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  }, [overrides]);

  const createMutation = useMutation({
    mutationFn: async (newOverrides: OverrideFormValues[]) => {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rules: newOverrides.map((o) => ({
            ...o,
            date: o.date ? dayjs(o.date).toISOString() : "",
          })),
          scheduleId,
        }),
      });
      if (!response.ok) throw new Error("Failed to create rules");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rules", scheduleId],
      });
      toast.success("Substituições criadas com sucesso!");
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error("Falha ao criar as substituições.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (overrideToUpdate: OverrideFormValues) => {
      if (!editingOverride) throw new Error("No override to update");
      const response = await fetch("/api/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...overrideToUpdate,
          availabilityRuleId: editingOverride.id,
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
      toast.success("Substituição atualizada com sucesso!");
      setIsFormOpen(false);
      setEditingOverride(null);
    },
    onError: () => {
      toast.error("Falha ao atualizar a substituição.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (availabilityRuleId: string) => {
      const response = await fetch("/api/rules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityRuleId }),
      });
      if (!response.ok) throw new Error("Failed to delete rule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rules", scheduleId],
      });
      toast.success("Substituição removida com sucesso!");
    },
    onError: () => {
      toast.error("Falha ao remover a substituição.");
    },
  });

  const handleSave = (values: OverrideFormValues[]) => {
    if (editingOverride) {
      updateMutation.mutate(values[0]);
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Substituições de data</CardTitle>
          <CardDescription>
            Adicione datas quando sua disponibilidade mudar em relação às suas
            horas diárias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {futureOverrides.length > 0 ? (
              futureOverrides.map((override) => (
                <div
                  key={override.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {dayjs(override.date).format("dddd, D [de] MMMM")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {override.isAllDay
                        ? "O dia todo"
                        : `${minutesToTime(
                            override.startTime,
                          )} - ${minutesToTime(override.endTime)}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingOverride(override);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(override.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma substituição futura encontrada.</p>
            )}
          </div>
          <Button
            className="mt-6"
            onClick={() => {
              setEditingOverride(null);
              setIsFormOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar uma substituição
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOverride
                ? "Editar substituição"
                : "Adicionar nova substituição"}
            </DialogTitle>
          </DialogHeader>
          <OverrideForm
            onSave={handleSave}
            initialData={editingOverride}
            scheduleId={scheduleId as string}
            existingOverrides={overrides || []}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
