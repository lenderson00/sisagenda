"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateAppointment } from "@/app/fornecedor/agendar/_hooks/use-create-appointment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { clearFormData, loadFormData, saveFormData } from "@/lib/storage";
import { cn } from "@/lib/utils";

import { useScheduleStore } from "../../_store";
import { Step1BasicInfo } from "./step-1-basic-info";
import { Step2Items } from "./step-2-items";

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
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const { schedule, isStale, clearSchedule } = useScheduleStore();

  const orgSlug = Array.isArray(params.omslug)
    ? params.omslug[0]
    : params.omslug;
  const deliverySlug = Array.isArray(params.deliveryslug)
    ? params.deliveryslug[0]
    : params.deliveryslug;

  // Early return if slugs are undefined
  if (!orgSlug || !deliverySlug) {
    return null;
  }

  // Assert types after early return
  const safeOrgSlug: string = orgSlug;
  const safeDeliverySlug: string = deliverySlug;

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

  // Check for stale schedule data
  useEffect(() => {
    if (isStale) {
      clearSchedule();
      router.push("/agendar");
    }
  }, [isStale, clearSchedule, router]);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = loadFormData(safeOrgSlug, safeDeliverySlug);
    if (savedData) {
      form.reset(savedData);
    }
  }, [safeOrgSlug, safeDeliverySlug, form]);

  // Save form data on changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data) {
        saveFormData(safeOrgSlug, safeDeliverySlug, data as DetailsFormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, safeOrgSlug, safeDeliverySlug]);

  useEffect(() => {
    if (createAppointmentMutation.isSuccess) {
      // Clear saved form data and schedule on successful submission
      clearFormData(safeOrgSlug, safeDeliverySlug);
      clearSchedule();
      router.push("/agendar/sucesso");
    }
  }, [
    createAppointmentMutation.isSuccess,
    router,
    safeOrgSlug,
    safeDeliverySlug,
    clearSchedule,
  ]);

  const items = form.watch("items");

  async function onSubmit(values: DetailsFormValues) {
    if (!schedule) {
      toast.error(
        "Dados do agendamento não encontrados. Por favor, selecione um novo horário.",
      );
      router.push("/agendar");
      return;
    }

    if (isStale) {
      clearSchedule();
      router.push("/agendar");
      return;
    }

    createAppointmentMutation.mutate({
      organizationId: schedule.organizationId,
      deliveryTypeId: schedule.deliveryTypeId,
      dateTime: schedule.dateTime.toISOString(),
      ordemDeCompra: values.ordemDeCompra,
      observations: values,
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
                    disabled={
                      createAppointmentMutation.isPending ||
                      !form.formState.isValid ||
                      items?.length === 0 ||
                      isStale
                    }
                  >
                    {createAppointmentMutation.isPending
                      ? "Agendando..."
                      : items?.length === 0
                        ? "Adicione itens para finalizar o agendamento"
                        : isStale
                          ? "Dados do agendamento expirados"
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
