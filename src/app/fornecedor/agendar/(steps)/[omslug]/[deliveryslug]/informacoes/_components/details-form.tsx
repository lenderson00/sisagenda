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
import { Step1SupplierInfo } from "./step-1-supplier-info";
import { Step2DeliveryDetails } from "./step-2-delivery-details";
import { Step3Items } from "./step-3-items";

const itemSchema = z.object({
  pi: z.string().min(1, "PI do item é obrigatório."),
  // Adicione outros campos do item aqui, se necessário
});

export const detailsFormSchema = z.object({
  // Step 1
  cnpj: z.string().min(1, "CNPJ é obrigatório."),
  razaoSocial: z.string().min(1, "Razão Social é obrigatória."),
  email: z.string().email("E-mail inválido."),
  driverName: z.string().min(1, "Nome do motorista é obrigatório."),
  vehiclePlate: z.string().min(1, "Placa do veículo é obrigatória."),
  contactPhone: z.string().min(1, "Telefone de contato é obrigatório."),
  additionalNotes: z.string().optional(),

  // Step 2
  notaFiscal: z.string().min(1, "Nota Fiscal é obrigatória."),
  ordemDeCompra: z.string().min(1, "Ordem de Compra é obrigatória."),
  isFirstDelivery: z.enum(["yes", "no"], {
    required_error: "Selecione uma opção.",
  }),
  processNumber: z.string().min(1, "Número do processo é obrigatório."),
  needsLabAnalysis: z.enum(["yes", "no"], {
    required_error: "Selecione uma opção.",
  }),
  // extraDocumentation: z.any().optional(), // Para anexo de arquivo

  // Step 3
  items: z
    .array(itemSchema)
    .min(1, "É necessário adicionar pelo menos um item."),
});

export type DetailsFormValues = z.infer<typeof detailsFormSchema>;

const steps = [
  {
    id: "supplier-info",
    name: "Informações do Fornecedor",
    fields: [
      "cnpj",
      "razaoSocial",
      "email",
      "driverName",
      "vehiclePlate",
      "contactPhone",
      "additionalNotes",
    ],
  },
  {
    id: "delivery-details",
    name: "Detalhes da Entrega",
    fields: [
      "notaFiscal",
      "ordemDeCompra",
      "isFirstDelivery",
      "processNumber",
      "needsLabAnalysis",
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
      items: [],
    },
  });

  const createAppointmentMutation = useCreateAppointment(
    schedule?.organizationId ?? "",
    schedule?.deliveryTypeId ?? "",
    schedule?.dateTime ?? new Date(),
  );

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

  if (!schedule) {
    return null;
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
              {currentStep === 0 && <Step1SupplierInfo />}
              {currentStep === 1 && <Step2DeliveryDetails />}
              {currentStep === 2 && <Step3Items />}
            </CardContent>

            <CardFooter className="flex justify-between">
              {currentStep > 0 && (
                <Button type="button" variant="secondary" onClick={prevStep}>
                  Anterior
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={nextStep}
                  className="ml-auto"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={
                    createAppointmentMutation.isPending || !items?.length
                  }
                >
                  {createAppointmentMutation.isPending
                    ? "Agendando..."
                    : "Finalizar Agendamento"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
}
