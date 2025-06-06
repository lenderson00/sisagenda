"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { DetailsFormValues } from "./details-form";

export function Step1BasicInfo() {
  const form = useFormContext<DetailsFormValues>();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informações Básicas</h2>
      <FormField
        control={form.control}
        name="ordemDeCompra"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ordem de Compra</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 12345/2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notaFiscal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nota Fiscal (Opcional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Número da Nota Fiscal"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="motorista"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Motorista (Opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome completo do motorista"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placaVeiculo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa do Veículo (Opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: BRA2E19"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="observacoesGerais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações Adicionais (Opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Qualquer informação adicional relevante para o agendamento."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
