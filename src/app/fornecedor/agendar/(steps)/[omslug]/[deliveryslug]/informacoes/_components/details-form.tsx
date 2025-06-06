"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateAppointment } from "@/app/fornecedor/agendar/_hooks/use-create-appointment";
import { useScheduleData } from "@/app/fornecedor/agendar/_hooks/use-schedule-data";
import { useSchedulingStore } from "@/app/fornecedor/agendar/_hooks/use-scheduling-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { Step1BasicInfo } from "./step-1-basic-info";
import { Step2Items } from "./step-2-items";
import { useScheduleStore } from "@/hooks/use-selected-date";

const itemSchema = z.object({
  name: z.string().min(1, "Nome do item é obrigatório."),
  quantity: z.coerce.number().min(0.01, "Quantidade deve ser maior que zero."),
  unit: z.string().min(1, "Unidade é obrigatória."),
  price: z.coerce.number().min(0, "Valor não pode ser negativo."),
});

export const detailsFormSchema = z.object({
  ordemDeCompra: z.string().min(1, "Ordem de Compra é obrigatória."),
  notaFiscal: z.string().optional(),
  motorista: z.string().optional(),
  placaVeiculo: z.string().optional(),
  observacoesGerais: z.string().optional(),
  items: z.array(itemSchema).optional(),
});

export type DetailsFormValues = z.infer<typeof detailsFormSchema>;

const steps = [
  {
    id: "basic-info",
    name: "Informações Básicas",
    fields: [
      "ordemDeCompra",
      "notaFiscal",
      "motorista",
      "placaVeiculo",
      "observacoesGerais",
    ],
  },
  { id: "items", name: "Itens da Entrega", fields: ["items"] },
];

export function DetailsForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    date,
    organizationId: organization,
    deliveryTypeId: deliveryType,
    clearSchedule,
  } = useScheduleStore();

  useEffect(() => {
    if (!organization || !deliveryType) {
      toast.error("Dados de agendamento inválidos. Redirecionando...");
      return;
    }

    if (!!date) {
      toast.error("Selecione uma data e hora primeiro. Redirecionando...");
      router.push(`/agendar/${organization}/${deliveryType}`);
    }
  }, [organization, deliveryType, date, router]);

  const form = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      ordemDeCompra: "",
      notaFiscal: "",
      motorista: "",
      placaVeiculo: "",
      observacoesGerais: "",
      items: [],
    },
  });

  const createAppointmentMutation = useCreateAppointment();

  useEffect(() => {
    if (createAppointmentMutation.isSuccess) {
      clearSchedule();
      router.push("/agendar/sucesso");
    }
  }, [createAppointmentMutation.isSuccess, router]);

  async function onSubmit(values: DetailsFormValues) {
    const { ordemDeCompra, ...observations } = values;

    if (!date || !organization || !deliveryType) {
      toast.error("Faltando dados do agendamento. Tente novamente.");
      return console.error("Missing data from scheduling store");
    }

    createAppointmentMutation.mutate({
      organizationId: organization,
      deliveryTypeId: deliveryType,
      dateTime: date,
      ordemDeCompra,
      observations,
    });
  }

  async function nextStep() {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as (keyof DetailsFormValues)[]);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }

  const isLoading = false;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="mx-auto h-8 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-center gap-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : index < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        index === currentStep
                          ? "font-semibold text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="h-0.5 w-16 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="py-6">
              {currentStep === 0 && <Step1BasicInfo />}
              {currentStep === 1 && <Step2Items />}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {currentStep > 0 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    Voltar
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                {currentStep < steps.length - 1 && (
                  <Button type="button" onClick={nextStep}>
                    Próximo
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="submit"
                    disabled={createAppointmentMutation.isPending}
                  >
                    {createAppointmentMutation.isPending
                      ? "Agendando..."
                      : "Finalizar Agendamento"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
}
