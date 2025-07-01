"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconColumns, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface ColumnSelectorProps {
  availableColumns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const columnLabels: Record<string, string> = {
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

export function ColumnSelector({
  availableColumns,
  selectedColumns,
  onColumnsChange,
}: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      onColumnsChange(selectedColumns.filter((c) => c !== column));
    } else {
      onColumnsChange([...selectedColumns, column]);
    }
  };

  const selectAll = () => {
    onColumnsChange(availableColumns);
  };

  const deselectAll = () => {
    onColumnsChange([]);
  };

  const removeColumn = (column: string) => {
    onColumnsChange(selectedColumns.filter((c) => c !== column));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconColumns className="h-5 w-5" />
          Colunas Selecionadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Columns Display */}
        <div className="space-y-2">
          <Label>Colunas Ativas</Label>
          <div className="flex flex-wrap gap-2">
            {selectedColumns.length > 0 ? (
              selectedColumns.map((column) => (
                <Badge key={column} variant="secondary" className="gap-1">
                  {columnLabels[column] || column}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeColumn(column)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma coluna selecionada. Selecione pelo menos uma coluna para
                exibir os resultados.
              </p>
            )}
          </div>
        </div>

        {/* Column Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Selecionar Colunas</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Selecionar Todas
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Limpar Todas
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
            {availableColumns.map((column) => (
              <div key={column} className="flex items-center space-x-2">
                <Checkbox
                  id={column}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => toggleColumn(column)}
                />
                <Label htmlFor={column} className="text-sm cursor-pointer">
                  {columnLabels[column] || column}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Selection Groups */}
        <div className="space-y-2">
          <Label>Seleções Rápidas</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onColumnsChange([
                  "id",
                  "internalId",
                  "date",
                  "status",
                  "ordemDeCompra",
                ])
              }
            >
              Básico
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onColumnsChange([
                  "id",
                  "internalId",
                  "date",
                  "status",
                  "ordemDeCompra",
                  "user",
                  "organization",
                ])
              }
            >
              Com Relações
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onColumnsChange([
                  "id",
                  "internalId",
                  "date",
                  "status",
                  "ordemDeCompra",
                  "user",
                  "organization",
                  "deliveryType",
                  "activities",
                ])
              }
            >
              Completo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
