import {
  buildBooleanFilter,
  buildDateFilter,
  buildEnumFilter,
  buildNumberFilter,
  buildStringFilter,
} from "./filterBuilders";
import type { AppointmentFilterFields, FilterCondition } from "./types";

/**
 * Field type mapping for appointment filters
 */
const FIELD_TYPE_MAP: Record<
  keyof AppointmentFilterFields,
  AppointmentFilterFields[keyof AppointmentFilterFields]["type"]
> = {
  // Date fields
  createdAt: "date",
  updatedAt: "date",

  // String fields
  internalId: "string",
  ordemDeCompra: "string",
  notaFiscal: "string",
  processNumber: "string",
  observation: "string",

  // Enum fields
  status: "enum",

  // Boolean fields
  isFirstDelivery: "boolean",
  needsLabAnalysis: "boolean",

  // Numeric fields
  duration: "number",

  // Relation fields
  userId: "string",
  deliveryTypeId: "string",
  organizationId: "string",
};

/**
 * Builds a Prisma where object from filter conditions
 * @param filters Array of filter conditions
 * @returns Prisma where object or undefined if no filters
 */
export function buildWhere(filters: FilterCondition[]) {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  const whereConditions: any[] = [];

  for (const filter of filters) {
    const { field, operator, value, value2 } = filter;

    // Skip invalid filters
    if (!field || !operator || value === undefined || value === null) {
      console.warn(`Invalid filter: ${JSON.stringify(filter)}`);
      continue;
    }

    // Get field type
    const fieldType = FIELD_TYPE_MAP[field as keyof AppointmentFilterFields];

    if (!fieldType) {
      console.warn(`Unknown field: ${field}`);
      continue;
    }

    try {
      let condition: any;

      // Build condition based on field type
      switch (fieldType) {
        case "date":
          condition = buildDateFilter(field, operator, value, value2);
          break;

        case "string":
          condition = buildStringFilter(field, operator, value);
          break;

        case "number":
          condition = buildNumberFilter(field, operator, value);
          break;

        case "boolean":
          condition = buildBooleanFilter(field, operator, value);
          break;

        case "enum":
          condition = buildEnumFilter(field, operator, value);
          break;

        default:
          console.warn(
            `Unsupported field type: ${fieldType} for field: ${field}`,
          );
      }

      if (condition) {
        whereConditions.push(condition);
      }
    } catch (error) {
      console.error(`Error building filter for field ${field}:`, error);
    }
  }

  // Combine all conditions with AND
  if (whereConditions.length === 0) {
    return undefined;
  }

  if (whereConditions.length === 1) {
    return whereConditions[0];
  }

  return {
    AND: whereConditions,
  };
}

/**
 * Gets the available filter fields configuration for the frontend
 * @returns AppointmentFilterFields configuration
 */
export function getFilterFieldsConfig() {
  return {
    fields: {
      // Date fields
      createdAt: {
        type: "date" as const,
        operators: ["equals", "before", "after", "between"] as const,
        label: "Data de Criação",
      },
      updatedAt: {
        type: "date" as const,
        operators: ["equals", "before", "after", "between"] as const,
        label: "Data de Atualização",
      },

      // String fields
      internalId: {
        type: "string" as const,
        operators: ["equals", "contains", "startsWith", "endsWith"] as const,
        label: "ID Interno",
      },
      ordemDeCompra: {
        type: "string" as const,
        operators: ["equals", "contains", "startsWith", "endsWith"] as const,
        label: "Ordem de Compra",
      },
      notaFiscal: {
        type: "string" as const,
        operators: ["equals", "contains", "startsWith", "endsWith"] as const,
        label: "Nota Fiscal",
      },
      processNumber: {
        type: "string" as const,
        operators: ["equals", "contains", "startsWith", "endsWith"] as const,
        label: "Número do Processo",
      },
      observation: {
        type: "string" as const,
        operators: ["contains"] as const,
        label: "Observação",
      },

      // Enum fields
      status: {
        type: "enum" as const,
        operators: ["equals", "in", "notIn"] as const,
        label: "Status",
        options: [
          { value: "PENDING_CONFIRMATION", label: "Pendente de Confirmação" },
          { value: "CONFIRMED", label: "Confirmado" },
          { value: "REJECTED", label: "Rejeitado" },
          { value: "CANCELLATION_REQUESTED", label: "Pedido de Cancelamento" },
          {
            value: "CANCELLATION_REJECTED",
            label: "Pedido de Cancelamento Rejeitado",
          },
          { value: "CANCELLED", label: "Cancelado" },
          { value: "RESCHEDULE_REQUESTED", label: "Reagendamento Solicitado" },
          { value: "RESCHEDULE_CONFIRMED", label: "Reagendamento Confirmado" },
          { value: "RESCHEDULE_REJECTED", label: "Reagendamento Rejeitado" },
          { value: "RESCHEDULED", label: "Reagendado" },
          { value: "COMPLETED", label: "Concluído" },
          { value: "SUPPLIER_NO_SHOW", label: "Fornecedor Não Compareceu" },
        ],
      },

      // Boolean fields
      isFirstDelivery: {
        type: "boolean" as const,
        operators: ["is", "isNot"] as const,
        label: "Primeira Entrega",
      },
      needsLabAnalysis: {
        type: "boolean" as const,
        operators: ["is", "isNot"] as const,
        label: "Necessita Análise Laboratorial",
      },

      // Numeric fields
      duration: {
        type: "number" as const,
        operators: ["equals", "gt", "gte", "lt", "lte"] as const,
        label: "Duração (minutos)",
      },

      // Relation fields
      userId: {
        type: "string" as const,
        operators: ["equals", "in", "notIn"] as const,
        label: "ID do Usuário",
      },
      deliveryTypeId: {
        type: "string" as const,
        operators: ["equals", "in", "notIn"] as const,
        label: "ID do Tipo de Entrega",
      },
      organizationId: {
        type: "string" as const,
        operators: ["equals", "in", "notIn"] as const,
        label: "ID da Organização",
      },
    },
  };
}
