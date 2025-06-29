/**
 * Available filter operators for different data types
 */
export type FilterOperator =
  // String operators
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'notIn'

  // Numeric operators
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

  // Date operators
  | 'before'
  | 'after'
  | 'between'

  // Boolean operators
  | 'is'
  | 'isNot'

/**
 * Filter condition structure
 */
export interface FilterCondition {
  field: string
  operator: FilterOperator
  value: any
  value2?: any // For 'between' operations
}

/**
 * Available filterable fields for appointments
 */
export interface AppointmentFilterFields {
  // Date fields
  createdAt: {
    type: 'date'
    operators: ['equals', 'before', 'after', 'between']
    label: 'Data de Criação'
  }
  updatedAt: {
    type: 'date'
    operators: ['equals', 'before', 'after', 'between']
    label: 'Data de Atualização'
  }

  // String fields
  internalId: {
    type: 'string'
    operators: ['equals', 'contains', 'startsWith', 'endsWith']
    label: 'ID Interno'
  }
  ordemDeCompra: {
    type: 'string'
    operators: ['equals', 'contains', 'startsWith', 'endsWith']
    label: 'Ordem de Compra'
  }
  notaFiscal: {
    type: 'string'
    operators: ['equals', 'contains', 'startsWith', 'endsWith']
    label: 'Nota Fiscal'
  }
  processNumber: {
    type: 'string'
    operators: ['equals', 'contains', 'startsWith', 'endsWith']
    label: 'Número do Processo'
  }
  observation: {
    type: 'string'
    operators: ['contains']
    label: 'Observação'
  }

  // Enum fields
  status: {
    type: 'enum'
    operators: ['equals', 'in', 'notIn']
    label: 'Status'
    options: [
      { value: 'PENDING_CONFIRMATION', label: 'Pendente de Confirmação' },
      { value: 'CONFIRMED', label: 'Confirmado' },
      { value: 'REJECTED', label: 'Rejeitado' },
      { value: 'CANCELLATION_REQUESTED', label: 'Pedido de Cancelamento' },
      { value: 'CANCELLATION_REJECTED', label: 'Pedido de Cancelamento Rejeitado' },
      { value: 'CANCELLED', label: 'Cancelado' },
      { value: 'RESCHEDULE_REQUESTED', label: 'Reagendamento Solicitado' },
      { value: 'RESCHEDULE_CONFIRMED', label: 'Reagendamento Confirmado' },
      { value: 'RESCHEDULE_REJECTED', label: 'Reagendamento Rejeitado' },
      { value: 'RESCHEDULED', label: 'Reagendado' },
      { value: 'COMPLETED', label: 'Concluído' },
      { value: 'SUPPLIER_NO_SHOW', label: 'Fornecedor Não Compareceu' }
    ]
  }

  // Boolean fields
  isFirstDelivery: {
    type: 'boolean'
    operators: ['is', 'isNot']
    label: 'Primeira Entrega'
  }
  needsLabAnalysis: {
    type: 'boolean'
    operators: ['is', 'isNot']
    label: 'Necessita Análise Laboratorial'
  }

  // Numeric fields
  duration: {
    type: 'number'
    operators: ['equals', 'gt', 'gte', 'lt', 'lte']
    label: 'Duração (minutos)'
  }

  // Relation fields (for future implementation)
  userId: {
    type: 'string'
    operators: ['equals', 'in', 'notIn']
    label: 'ID do Usuário'
  }
  deliveryTypeId: {
    type: 'string'
    operators: ['equals', 'in', 'notIn']
    label: 'ID do Tipo de Entrega'
  }
  organizationId: {
    type: 'string'
    operators: ['equals', 'in', 'notIn']
    label: 'ID da Organização'
  }
}

/**
 * Configuration object for the filter builder
 */
export interface FilterConfig {
  fields: AppointmentFilterFields
}

/**
 * Type for getting the field names from AppointmentFilterFields
 */
export type AppointmentFilterFieldName = keyof AppointmentFilterFields

/**
 * Type for getting the field type from a specific field
 */
export type FieldType<T extends AppointmentFilterFieldName> = AppointmentFilterFields[T]['type']

/**
 * Type for getting the operators for a specific field
 */
export type FieldOperators<T extends AppointmentFilterFieldName> = AppointmentFilterFields[T]['operators'][number]
