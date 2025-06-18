"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AvailabilityRule } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import RuleForm from "../../_components/rule-form";
import type { AvailabilityExceptionRule } from "../../_components/types";
import { toast } from "sonner";

export default function EditRulePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const ruleIndex = Number(params.ruleId);

  const { data: availabilityRule, isLoading } = useQuery<
    AvailabilityRule & { deliveryTypes: { id: string }[] }
  >({
    queryKey: ["availability-rule"],
    queryFn: async () => {
      const response = await fetch("/api/rules");
      if (!response.ok) throw new Error("Failed to fetch rules");
      const result = await response.json();
      return result?.[0] || null;
    },
  });

  const mutation = useMutation({
    mutationFn: async (variables: {
      rules: AvailabilityExceptionRule[];
      deliveryTypeIds: string[];
    }) => {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
      if (!response.ok) throw new Error("Failed to save rule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-rule"] });
    },
  });

  const handleSave = async (
    rules: AvailabilityExceptionRule[],
    deliveryTypeIds: string[],
  ) => {
    await mutation.mutateAsync({ rules, deliveryTypeIds });
  };

  const handleDelete = async () => {
    if (!availabilityRule) return;
    const currentRules =
      (availabilityRule.rule as unknown as AvailabilityExceptionRule[]) || [];
    const newRules = currentRules.filter((_, index) => index !== ruleIndex);
    const deliveryTypeIds = availabilityRule.deliveryTypes.map((dt) => dt.id);
    await mutation.mutateAsync({ rules: newRules, deliveryTypeIds });
    toast.success("Regra removida com sucesso!");
    router.push("/bloqueio-de-datas");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const rules = availabilityRule?.rule
    ? (availabilityRule.rule as unknown as AvailabilityExceptionRule[])
    : [];
  const deliveryTypeIds =
    availabilityRule?.deliveryTypes.map((dt) => dt.id) || [];

  const ruleToEdit = rules[ruleIndex];

  if (!ruleToEdit) {
    return <div>Regra não encontrada.</div>;
  }

  return (
    <RuleForm
      initialData={ruleToEdit}
      rules={rules}
      deliveryTypeIds={deliveryTypeIds}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
