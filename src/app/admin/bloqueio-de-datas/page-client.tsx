"use client";

import { Button } from "@/components/ui/button";
import type { AvailabilityRule } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import RuleBuilder from "./_components/rule-builder";
import { RuleCard } from "./_components/rule-card";
import type { AvailabilityExceptionRule } from "./_components/types";

export default function RegrasDeDisponibilidadePageClient() {
  const [open, setOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<{
    rule: AvailabilityExceptionRule;
    index: number;
  } | null>(null);

  const { data: availabilityRule, isLoading } = useQuery<
    AvailabilityRule & { deliveryTypes: { id: string }[] }
  >({
    queryKey: ["availability-rule"],
    queryFn: async () => {
      const response = await fetch("/api/rules");
      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }
      const result = await response.json();
      return result?.[0]; // Assuming one rule object per org
    },
  });

  const rules = availabilityRule?.rule
    ? (availabilityRule.rule as unknown as AvailabilityExceptionRule[])
    : [];
  const deliveryTypeIds =
    availabilityRule?.deliveryTypes.map((dt) => dt.id) || [];

  const handleEditRule = (rule: AvailabilityExceptionRule, index: number) => {
    setEditingRule({ rule, index });
    setOpen(true);
  };

  const handleAddNewRule = () => {
    setEditingRule(null);
    setOpen(true);
  };

  return (
    <div className="w-full ">
      <AddRuleDialog
        rules={rules}
        deliveryTypeIds={deliveryTypeIds}
        setOpen={setOpen}
        open={open}
        editingRule={editingRule}
        onClose={() => setOpen(false)}
      />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Regras de Bloqueio</h1>
        <Button onClick={handleAddNewRule} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Regra
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 border rounded">
            Carregando regras...
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-10 border rounded">
            Nenhuma regra cadastrada ainda.
          </div>
        ) : (
          rules.map((rule, idx) => (
            <RuleCard
              key={idx}
              rule={rule}
              index={idx}
              onEdit={() => handleEditRule(rule, idx)}
            />
          ))
        )}
      </div>
    </div>
  );
}

const AddRuleDialog = ({
  rules,
  deliveryTypeIds,
  setOpen,
  open,
  editingRule,
  onClose,
}: {
  rules: AvailabilityExceptionRule[];
  deliveryTypeIds: string[];
  setOpen: (open: boolean) => void;
  open: boolean;
  editingRule: { rule: AvailabilityExceptionRule; index: number } | null;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (variables: {
      rules: AvailabilityExceptionRule[];
      deliveryTypeIds: string[];
    }) => {
      const { rules, deliveryTypeIds } = variables;
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules, deliveryTypeIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to save rule");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-rule"] });
    },
  });

  return (
    <RuleBuilder
      open={open}
      onClose={onClose}
      editingRule={editingRule}
      rules={rules}
      deliveryTypeIds={deliveryTypeIds}
      onRuleCreated={(rule, newDeliveryTypeIds) => {
        mutation.mutate({
          rules: [...rules, rule],
          deliveryTypeIds: newDeliveryTypeIds,
        });
      }}
      onRulesUpdated={(updatedRules, newDeliveryTypeIds) => {
        mutation.mutate({
          rules: updatedRules,
          deliveryTypeIds: newDeliveryTypeIds,
        });
      }}
    />
  );
};
