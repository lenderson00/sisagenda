"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import type { AppointmentFilterFields } from "@/lib/query/types";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDatabase,
  IconLoader,
} from "@tabler/icons-react";
import { useState } from "react";
import { DragDropColumnSelector } from "../_components/drag-drop-column-selector";
import { FilterBuilder } from "../_components/filter-builder";
import { Stepper } from "../_components/stepper";
import { useFilterContext } from "../_context/filter-context";
import { useFilterConfig } from "../_hooks/use-filter-config";

// All available columns for appointments
const AVAILABLE_COLUMNS = [
  "id",
  "internalId",
  "date",
  "duration",
  "ordemDeCompra",
  "notaFiscal",
  "isFirstDelivery",
  "processNumber",
  "needsLabAnalysis",
  "observation",
  "observations",
  "status",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "userId",
  "deliveryTypeId",
  "organizationId",
  "user",
  "deliveryType",
  "organization",
  "activities",
  "items",
  "attachments",
];

export function FilterBuilderClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: filterConfig, isLoading: configLoading } = useFilterConfig();
  const {
    filters,
    setFilters,
    selectedColumns,
    setSelectedColumns,
    executeQuery,
    isLoaded,
  } = useFilterContext();

  const steps = [
    { id: "1", name: "Definir Filtros" },
    { id: "2", name: "Selecionar Colunas" },
  ];

  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return "complete";
    if (currentStep === stepId) return "current";
    return "upcoming";
  };

  const goToNextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length));
  const goToPrevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const goToStep = (stepId: string) => {
    const stepNumber = Number(stepId);
    if (getStepStatus(stepNumber) === "complete") {
      setCurrentStep(stepNumber);
    }
  };

  if (configLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <IconLoader className="mx-auto h-8 w-8 mb-4 animate-spin" />
          <p>Carregando configuração...</p>
        </div>
      </div>
    );
  }

  if (!filterConfig) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <IconDatabase className="mx-auto h-8 w-8 mb-4 text-destructive" />
          <p className="text-destructive">
            Erro ao carregar configuração de filtros.
          </p>
        </div>
      </div>
    );
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      {currentStep > 1 && (
        <Button variant="outline" onClick={goToPrevStep}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      )}
      {currentStep < steps.length ? (
        <Button onClick={goToNextStep}>
          Próximo
          <IconArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={executeQuery} disabled={selectedColumns.length === 0}>
          <IconArrowRight className="mr-2 h-4 w-4" />
          Executar Consulta
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Construir Consulta"
        subtitle="Siga os passos para configurar e executar sua consulta"
      >
        {headerActions}
      </PageHeader>

      <div className="p-4 md:p-6 space-y-8">
        <Stepper
          steps={steps.map((s) => ({
            ...s,
            status: getStepStatus(Number(s.id)),
          }))}
          onStepClick={goToStep}
        />

        <div className="mt-6">
          {currentStep === 1 && (
            <FilterBuilder
              config={filterConfig.fields as unknown as AppointmentFilterFields}
              filters={filters}
              onFiltersChange={setFilters}
            />
          )}
          {currentStep === 2 && (
            <DragDropColumnSelector
              availableColumns={AVAILABLE_COLUMNS}
              selectedColumns={selectedColumns}
              onColumnsChange={setSelectedColumns}
            />
          )}
        </div>
      </div>
    </>
  );
}
