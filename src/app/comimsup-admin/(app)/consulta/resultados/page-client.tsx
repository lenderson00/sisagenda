"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconDatabase,
  IconTable,
  IconRefresh,
  IconDownload,
  IconEye,
  IconArrowLeft,
  IconSettings,
  IconLoader,
} from "@tabler/icons-react";
import { ConsultaResultsTable } from "../_components/consulta-results-table";
import { useAppointmentFilters } from "../_hooks/use-appointment-filters";
import { useFilterContext } from "../_context/filter-context";

export function ConsultaResultsClient() {
  const router = useRouter();
  const { filters, selectedColumns, limit, isLoaded, loadConfiguration } =
    useFilterContext();

  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      loadConfiguration();
    }
  }, [isLoaded, loadConfiguration]);

  useEffect(() => {
    if (isLoaded) {
      if (filters.length === 0 && selectedColumns.length === 0) {
        router.push("/comimsup-admin/consulta/construir");
      } else {
        setIsQueryEnabled(true);
      }
    }
  }, [isLoaded, filters, selectedColumns, router]);

  const {
    data: appointmentData,
    isLoading: dataLoading,
    error,
    refetch,
  } = useAppointmentFilters(
    {
      filters,
      columns: selectedColumns,
      limit,
    },
    isQueryEnabled,
  );

  const exportData = () => {
    if (!appointmentData?.data) return;
    const csvContent = generateCSV(appointmentData.data, selectedColumns);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `consulta_agendamentos_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (data: any[], columns: string[]) => {
    const headers = columns.map((col) => getColumnLabel(col)).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = getNestedValue(row, col);
          return typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(","),
    );
    return [headers, ...rows].join("\n");
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const getColumnLabel = (column: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      internalId: "ID Interno",
      date: "Data",
      duration: "Duração",
      ordemDeCompra: "Ordem de Compra",
      notaFiscal: "Nota Fiscal",
      isFirstDelivery: "Primeira Entrega",
      processNumber: "Número do Processo",
      needsLabAnalysis: "Necessita Análise",
      observation: "Observação",
      observations: "Observações",
      status: "Status",
      createdAt: "Data de Criação",
      updatedAt: "Data de Atualização",
      deletedAt: "Data de Exclusão",
      userId: "ID do Usuário",
      deliveryTypeId: "ID do Tipo de Entrega",
      organizationId: "ID da Organização",
      user: "Usuário",
      deliveryType: "Tipo de Entrega",
      organization: "Organização",
      activities: "Atividades",
      items: "Itens",
      attachments: "Anexos",
    };
    return labels[column] || column;
  };

  const goToBuilder = () => {
    router.push("/comimsup-admin/consulta/construir");
  };

  if (!isLoaded || (isQueryEnabled && dataLoading && !appointmentData)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <IconLoader className="mx-auto h-12 w-12 mb-4 animate-spin" />
          <p>Carregando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Resultados da Consulta"
        subtitle="Visualize os dados encontrados com base nos filtros aplicados"
        backButton
      >
        <Button onClick={() => refetch()} disabled={dataLoading}>
          <IconRefresh className="mr-2 h-4 w-4" />
          {dataLoading ? "Atualizando..." : "Atualizar"}
        </Button>
      </PageHeader>

      <div className="grid gap-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Execução</CardTitle>
            <CardDescription>
              Resultados e ações disponíveis para a consulta realizada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <IconTable className="h-5 w-5" />
                <span className="font-medium">
                  {appointmentData?.data.length ?? 0} resultado(s) encontrado(s)
                </span>
              </div>
              {appointmentData?.pagination.hasNextPage && (
                <Badge variant="secondary">Mais resultados disponíveis</Badge>
              )}
            </div>
            {appointmentData?.data && appointmentData.data.length > 0 && (
              <Button onClick={exportData}>
                <IconDownload className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            )}
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-destructive">
                <IconDatabase className="mx-auto h-12 w-12 mb-4" />
                <p>Erro ao executar consulta</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {appointmentData?.data && appointmentData.data.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Resultados Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsultaResultsTable
                data={appointmentData.data}
                queryType="appointments"
              />
            </CardContent>
          </Card>
        ) : (
          !dataLoading && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <IconEye className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Nenhum resultado encontrado.</p>
                  <p className="text-sm">
                    Tente ajustar os filtros na tela de construção.
                  </p>
                  <Button
                    variant="outline"
                    onClick={goToBuilder}
                    className="mt-4"
                  >
                    <IconSettings className="mr-2 h-4 w-4" />
                    Ajustar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </>
  );
}
