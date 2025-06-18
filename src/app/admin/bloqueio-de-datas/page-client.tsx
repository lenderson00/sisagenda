"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AvailabilityRule } from "@prisma/client";
import { toast } from "sonner";
import { RuleCard } from "./_components/rule-card";
import type { AvailabilityExceptionRule } from "./_components/types";

export default function BlockPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: availabilityRule,
    isLoading,
    error,
  } = useQuery<AvailabilityRule & { deliveryTypes: { id: string }[] }>({
    queryKey: ["availability-rule"],
    queryFn: async () => {
      const response = await fetch("/api/rules");
      if (!response.ok) {
        throw new Error("Failed to fetch availability rules");
      }
      const data = await response.json();
      return data?.[0] || null; // Assuming only one rule document per organization
    },
  });

  const mutation = useMutation({
    mutationFn: async (variables: {
      rules: AvailabilityExceptionRule[];
      deliveryTypeIds: string[];
    }) => {
      const response = await fetch("/api/rules", {
        method: "POST", // Using POST for upsert
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
      if (!response.ok) {
        throw new Error("Failed to update rules");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-rule"] });
      toast.success("Regras atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Falha ao atualizar as regras.");
    },
  });

  const handleRuleUpdate = (updatedRules: AvailabilityExceptionRule[]) => {
    if (!availabilityRule) return;
    mutation.mutate({
      rules: updatedRules,
      deliveryTypeIds: availabilityRule.deliveryTypes.map((dt) => dt.id),
    });
  };

  const rules: AvailabilityExceptionRule[] =
    (availabilityRule?.rule as unknown as AvailabilityExceptionRule[]) || [];

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar as regras.</div>;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bloqueio de Datas
          </h1>
          <p className="text-muted-foreground">
            Gerencie os períodos em que os serviços não estarão disponíveis.
          </p>
        </div>
        <Button asChild>
          <Link href="/bloqueio-de-datas/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Regra
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        {rules.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule, index) => (
              <RuleCard
                key={index}
                rule={rule}
                ruleId={index}
                onEdit={() => router.push(`/bloqueio-de-datas/editar/${index}`)}
                onDelete={() => {
                  const newRules = rules.filter((_, i) => i !== index);
                  handleRuleUpdate(newRules);
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="flex h-60 flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>Nenhuma regra de bloqueio encontrada</CardTitle>
              <CardDescription>
                Crie uma nova regra para bloquear datas específicas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/bloqueio-de-datas/novo">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Primeira Regra
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
