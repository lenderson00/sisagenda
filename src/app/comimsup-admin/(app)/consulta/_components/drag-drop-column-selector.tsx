"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  IconColumns,
  IconGripVertical,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

interface DragDropColumnSelectorProps {
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

export function DragDropColumnSelector({
  availableColumns,
  selectedColumns,
  onColumnsChange,
}: DragDropColumnSelectorProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const availableColumnsFiltered = availableColumns.filter(
    (col) => !selectedColumns.includes(col),
  );

  const addColumn = (column: string) => {
    onColumnsChange([...selectedColumns, column]);
  };

  const removeColumn = (column: string) => {
    onColumnsChange(selectedColumns.filter((c) => c !== column));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...selectedColumns];
    const [movedItem] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedItem);
    onColumnsChange(newColumns);
  };

  const handleDragStart = (e: React.DragEvent, column: string) => {
    setDraggedItem(column);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem && dragOverIndex !== null) {
      const draggedIndex = selectedColumns.indexOf(draggedItem);
      if (draggedIndex !== -1) {
        moveColumn(draggedIndex, dropIndex);
      }
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const selectAll = () => {
    onColumnsChange(availableColumns);
  };

  const deselectAll = () => {
    onColumnsChange([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Colunas da Consulta
          </h2>
          <p className="text-muted-foreground text-sm">
            Arraste para reordenar, adicione ou remova colunas.
          </p>
        </div>
      </div>
      {/* Selected Columns with Drag & Drop */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Colunas Ativas ({selectedColumns.length})
          </Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              <IconPlus className="h-3 w-3 mr-1" />
              Todas
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              <IconTrash className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
        </div>

        <div className="min-h-[120px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-3">
          {selectedColumns.length > 0 ? (
            <div className="space-y-2">
              {selectedColumns.map((column, index) => (
                <div
                  key={column}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`
                    flex items-center gap-2 p-2 rounded-md border cursor-move
                    transition-all duration-200
                    ${draggedItem === column ? "opacity-50" : ""}
                    ${
                      dragOverIndex === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <IconGripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Badge variant="secondary" className="flex-1 justify-start">
                    {columnLabels[column] || column}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => removeColumn(column)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              <p className="text-sm">
                Arraste colunas aqui ou selecione abaixo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Columns */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Colunas Disponíveis ({availableColumnsFiltered.length})
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {availableColumnsFiltered.map((column) => (
            <button
              key={column}
              type="button"
              className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer text-left"
              onClick={() => addColumn(column)}
              aria-label={`Adicionar coluna ${columnLabels[column] || column}`}
            >
              <span className="text-sm truncate">
                {columnLabels[column] || column}
              </span>
              <IconPlus className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Selection Groups */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Seleções Rápidas</Label>
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
    </div>
  );
}
