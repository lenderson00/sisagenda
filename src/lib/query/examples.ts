import type { FilterCondition } from './types'

/**
 * Example filter conditions for testing the buildWhere function
 */
export const exampleFilters: FilterCondition[] = [
  // Date filters
  {
    field: 'createdAt',
    operator: 'after',
    value: '2024-01-01T00:00:00Z'
  },
  {
    field: 'updatedAt',
    operator: 'between',
    value: '2024-01-01T00:00:00Z',
    value2: '2024-12-31T23:59:59Z'
  },

  // String filters
  {
    field: 'ordemDeCompra',
    operator: 'contains',
    value: 'OC2024'
  },
  {
    field: 'status',
    operator: 'in',
    value: ['CONFIRMED', 'COMPLETED']
  },

  // Boolean filters
  {
    field: 'isFirstDelivery',
    operator: 'is',
    value: true
  },

  // Numeric filters
  {
    field: 'duration',
    operator: 'gte',
    value: 60
  }
]

/**
 * Example API usage:
 *
 * GET /api/query?filters=[{"field":"createdAt","operator":"after","value":"2024-01-01T00:00:00Z"},{"field":"status","operator":"equals","value":"CONFIRMED"}]&columns=id,internalId,date,status,user&limit=50
 *
 * This would:
 * - Filter appointments created after January 1, 2024
 * - Filter appointments with status "CONFIRMED"
 * - Select only id, internalId, date, status, and user fields
 * - Limit results to 50 items
 */
