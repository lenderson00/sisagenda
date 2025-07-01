"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AppointmentFilterFieldName,
  FilterCondition,
  FilterConfig,
  FilterOperator,
} from "@/lib/query/types";
import {
  IconCalendar,
  IconFilter,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

interface FilterBuilderProps {
  config: FilterConfig["fields"];
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

export function FilterBuilder({
  config,
  filters,
  onFiltersChange,
}: FilterBuilderProps) {
  const addFilter = () => {
    const firstField = Object.keys(config)[0] as AppointmentFilterFieldName;
    const newFilter: FilterCondition = {
      field: firstField,
      operator: config[firstField].operators[0],
      value: "",
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (
    index: number,
    updatedFilter: Partial<FilterCondition>,
  ) => {
    const newFilters = [...filters];
    const currentFilter = newFilters[index];
    const newField = updatedFilter.field;

    if (newField && newField !== currentFilter.field) {
      const newFieldCasted = newField as AppointmentFilterFieldName;
      const newFieldConfig = config[newFieldCasted];
      newFilters[index] = {
        ...currentFilter,
        field: newField,
        operator: newFieldConfig.operators[0],
        value: newFieldConfig.type === "boolean" ? false : "",
        value2: undefined,
      };
    } else {
      newFilters[index] = { ...currentFilter, ...updatedFilter };
    }

    onFiltersChange(newFilters);
  };

  const renderInput = (index: number) => {
    const filter = filters[index];
    const fieldCasted = filter.field as AppointmentFilterFieldName;
    const fieldConfig = config[fieldCasted];

    const commonProps = {
      id: `filter-value-${index}`,
      value: filter.value as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateFilter(index, { value: e.target.value }),
    };

    switch (fieldConfig.type) {
      case "string":
        return <Input placeholder="Valor" {...commonProps} />;
      case "number":
        return <Input type="number" placeholder="Valor" {...commonProps} />;
      case "date":
        return (
          <div className="relative">
            <Input type="date" {...commonProps} className="pr-8" />
            <IconCalendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`filter-value-${index}`}
              checked={filter.value as boolean}
              onCheckedChange={(checked) =>
                updateFilter(index, { value: checked })
              }
            />
            <Label htmlFor={`filter-value-${index}`}>
              {filter.value ? "Sim" : "Não"}
            </Label>
          </div>
        );
      case "enum":
        return (
          <Select
            value={filter.value as string}
            onValueChange={(value) => updateFilter(index, { value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um valor" />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map(
                (option: { value: string; label: string }) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const renderSecondInput = (index: number) => {
    const filter = filters[index];
    const fieldCasted = filter.field as AppointmentFilterFieldName;
    const fieldConfig = config[fieldCasted];

    if (filter.operator !== "between") return null;

    return (
      <div className="relative">
        <Input
          type={fieldConfig.type === "date" ? "date" : "number"}
          value={(filter.value2 as string) || ""}
          onChange={(e) => updateFilter(index, { value2: e.target.value })}
          placeholder="Valor final"
          className={fieldConfig.type === "date" ? "pr-8" : ""}
        />
        {fieldConfig.type === "date" && (
          <IconCalendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Construtor de Filtros
          </h2>
          <p className="text-muted-foreground text-sm">
            Adicione e configure regras para filtrar os resultados da consulta.
          </p>
        </div>
      </div>
      {filters.length > 0 ? (
        <div className="space-y-4">
          {filters.map((filter, index) => {
            const fieldCasted = filter.field as AppointmentFilterFieldName;
            return (
              <Card key={index} className="bg-muted/50 p-4">
                <div className="grid gap-3 md:grid-cols-3 md:gap-4 items-end">
                  {/* Field Selector */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`filter-field-${index}`}>Campo</Label>
                    <Select
                      value={filter.field}
                      onValueChange={(field) => updateFilter(index, { field })}
                    >
                      <SelectTrigger id={`filter-field-${index}`}>
                        <SelectValue placeholder="Selecione um campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(config).map(([key, fieldConfig]) => (
                          <SelectItem key={key} value={key}>
                            {fieldConfig.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator Selector */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`filter-operator-${index}`}>Operador</Label>
                    <Select
                      value={filter.operator}
                      onValueChange={(operator) =>
                        updateFilter(index, {
                          operator: operator as FilterOperator,
                        })
                      }
                    >
                      <SelectTrigger id={`filter-operator-${index}`}>
                        <SelectValue placeholder="Selecione um operador" />
                      </SelectTrigger>
                      <SelectContent>
                        {config[fieldCasted].operators.map((op: string) => (
                          <SelectItem key={op} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value Input(s) */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`filter-value-${index}`}>Valor</Label>
                    <div className="flex items-center gap-2">
                      {renderInput(index)}
                      {renderSecondInput(index)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFilter(index)}
                        className="flex-shrink-0"
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
          <IconFilter className="h-10 w-10 mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium">Nenhum filtro adicionado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique no botão abaixo para começar a construir sua consulta.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button onClick={addFilter}>
          <IconPlus className="mr-2 h-4 w-4" />
          Adicionar Filtro
        </Button>

        {filters.length > 1 && (
          <Button variant="destructive" onClick={() => onFiltersChange([])}>
            <IconTrash className="mr-2 h-4 w-4" />
            Remover Todos
          </Button>
        )}
      </div>
    </div>
  );
}
