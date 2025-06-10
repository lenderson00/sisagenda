"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
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
  const queryClient = useQueryClient();
  const params = useParams();
  const deliveryTypeId = params.deliveryTypeId as string;

  const { data: rules = [], isLoading } = useQuery<AvailabilityExceptionRule[]>(
    {
      queryKey: ["rules", deliveryTypeId],
      queryFn: async () => {
        const response = await fetch(
          `/api/rules?deliveryTypeId=${deliveryTypeId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rules");
        }
        const result = await response.json();
        console.log(result, "RESULT");
        return result;
      },
    },
  );

  const createRuleMutation = useMutation({
    mutationFn: async (rule: AvailabilityExceptionRule) => {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: [...rules, rule], deliveryTypeId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create rule");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<AvailabilityExceptionRule[]>(
        ["rules", deliveryTypeId],
        data.rule,
      );
    },
  });

  const updateRulesMutation = useMutation({
    mutationFn: async (updatedRules: AvailabilityExceptionRule[]) => {
      const response = await fetch("/api/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: updatedRules, deliveryTypeId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update rules");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<AvailabilityExceptionRule[]>(
        ["rules", deliveryTypeId],
        data.rule,
      );
    },
  });

  const handleEditRule = (rule: AvailabilityExceptionRule, index: number) => {
    setEditingRule({ rule, index });
    setOpen(true);
  };

  const handleAddNewRule = () => {
    setEditingRule(null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingRule(null);
  };

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Regras de Disponibilidade
        </h1>
        <Button onClick={handleAddNewRule} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Regra
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-slate-500 text-center py-10 border rounded bg-slate-50">
            Carregando regras...
          </div>
        ) : rules.length === 0 ? (
          <div className="text-slate-500 text-center py-10 border rounded bg-slate-50">
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
      <RuleBuilder
        open={open}
        onClose={handleCloseDialog}
        editingRule={editingRule}
        rules={rules}
        onRuleCreated={(rule) => createRuleMutation.mutate(rule)}
        onRulesUpdated={(updatedRules) =>
          updateRulesMutation.mutate(updatedRules)
        }
      />
    </div>
  );
}
