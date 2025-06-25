"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";
import "dayjs/locale/pt-br";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import type { AvailabilityRule } from "@prisma/client";
import Link from "next/link";
import { EmptyCard } from "@/components/empty-card";
import { IconCalendarOff } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.locale("pt-br");

export type DateOverride = AvailabilityRule;

const minutesToTime = (minutes: number | null) => {
  if (minutes === null) return "";
  return dayjs().startOf("day").add(minutes, "minute").format("HH:mm");
};

// Skeleton for loading state
function DateOverrideSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export default function PageClient() {
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

  const futureOverrides = useMemo(() => {
    const yesterday = dayjs().subtract(1, "day").endOf("day");
    return (overrides || [])
      .filter(
        (override) => override.date && dayjs(override.date).isAfter(yesterday),
      )
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  }, [overrides]);

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

  if (isLoading)
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <DateOverrideSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
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
                  onClick={() =>
                    router.push(
                      `/disponibilidade/${scheduleId}/sobescrever-datas/editar/${override.id}`,
                    )
                  }
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
          <EmptyCard
            title="Nenhuma substituição futura encontrada."
            description="Adicione uma substituição para um dia futuro."
            icon={IconCalendarOff}
          >
            <Button asChild>
              <Link
                href={`/disponibilidade/${scheduleId}/sobescrever-datas/novo`}
              >
                Adicionar uma substituição
              </Link>
            </Button>
          </EmptyCard>
        )}
      </div>
    </>
  );
}
