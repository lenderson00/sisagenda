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
      dateTime: new Date(schedule.dateTime),
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
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2",
                        currentStep >= index
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground",
                      )}
                    >
                      {currentStep > index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span
                          className={cn(
                            currentStep === index
                              ? "text-primary-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        currentStep >= index
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              {currentStep === 0 && <Step1BasicInfo />}
              {currentStep === 1 && <Step2Items />}
            </CardContent>

            <CardFooter className="flex justify-between">
              {currentStep > 0 && (
                <Button type="button" variant="secondary" onClick={prevStep}>
                  Anterior
                </Button>
              )}

              {currentStep < steps.length - 1 && (
                <Button
                  type="button"
                  variant="default"
                  onClick={nextStep}
                  className="ml-auto"
                >
                  Próximo
                </Button>
              )}

              {currentStep === steps.length - 1 && (
                <Button
                  type="submit"
                  disabled={
                    createAppointmentMutation.isPending || !items?.length
                  }
                  className="ml-auto"
                >
                  {createAppointmentMutation.isPending
                    ? "Agendando..."
                    : "Confirmar Agendamento"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
}
