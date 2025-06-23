"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AvailabilityRule } from "@prisma/client";
import type { AvailabilityExceptionRule } from "../_components/types";
import RuleForm from "../_components/rule-form";

export default function NewRulePage() {
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const rules = availabilityRule?.rule
    ? (availabilityRule.rule as unknown as AvailabilityExceptionRule[])
    : [];
  const deliveryTypeIds =
    availabilityRule?.deliveryTypes.map((dt) => dt.id) || [];

  return (
    <RuleForm
      rules={rules}
      deliveryTypeIds={deliveryTypeIds}
      onSave={handleSave}
    />
  );
}
