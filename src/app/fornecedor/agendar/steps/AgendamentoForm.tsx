"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import {
  agendamentoSchema,
  useAgendamentoStore,
} from "../store/useAgendamentoStore";

export function AgendamentoForm() {
  const { agendamento, updateAgendamento, setStep, resetAgendamento } =
    useAgendamentoStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Here you would typically make an API call to save the appointment
      console.log("Agendamento:", { ...agendamento, ...data });

      // Reset the form and show success message
      resetAgendamento();
      // You might want to show a success message or redirect
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className="text-sm font-medium">
            Nome
          </label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Seu nome completo"
            className="mt-1"
          />
          {errors.nome && (
            <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="seu@email.com"
            className="mt-1"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="telefone" className="text-sm font-medium">
            Telefone
          </label>
          <Input
            id="telefone"
            {...register("telefone")}
            placeholder="(00) 00000-0000"
            className="mt-1"
          />
          {errors.telefone && (
            <p className="text-sm text-red-500 mt-1">
              {errors.telefone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="observacoes" className="text-sm font-medium">
            Observações
          </label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            placeholder="Alguma observação importante?"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setStep(2)}
        >
          Voltar
        </Button>
        <Button type="submit" className="w-full">
          Confirmar Agendamento
        </Button>
      </div>
    </form>
  );
}
