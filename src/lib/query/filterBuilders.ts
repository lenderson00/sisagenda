import type { FilterCondition, FilterOperator } from './types'

/**
 * Builds date filter conditions for Prisma
 */
export function buildDateFilter(field: string, operator: FilterOperator, value: any, value2?: any) {
  const dateValue = new Date(value)
  const dateValue2 = value2 ? new Date(value2) : null

  switch (operator) {
    case 'equals':
      return {
        [field]: {
          gte: new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()),
          lt: new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate() + 1)
        }
      }

    case 'before':
      return {
        [field]: {
          lt: dateValue
        }
      }

    case 'after':
      return {
        [field]: {
          gt: dateValue
        }
      }

    case 'between':
      if (!dateValue2) {
        throw new Error('Between operator requires two values')
      }
      return {
        [field]: {
          gte: dateValue,
          lte: dateValue2
        }
      }

    default:
      throw new Error(`Unsupported date operator: ${operator}`)
  }
}

/**
 * Builds string filter conditions for Prisma
 */
export function buildStringFilter(field: string, operator: FilterOperator, value: any) {
  switch (operator) {
    case 'equals':
      return {
        [field]: value
      }

    case 'contains':
      return {
        [field]: {
          contains: value,
          mode: 'insensitive'
        }
      }

    case 'startsWith':
      return {
        [field]: {
          startsWith: value,
          mode: 'insensitive'
        }
      }

    case 'endsWith':
      return {
        [field]: {
          endsWith: value,
          mode: 'insensitive'
        }
      }

    case 'in':
      return {
        [field]: {
          in: Array.isArray(value) ? value : [value]
        }
      }

    case 'notIn':
      return {
        [field]: {
          notIn: Array.isArray(value) ? value : [value]
        }
      }

    default:
      throw new Error(`Unsupported string operator: ${operator}`)
  }
}

/**
 * Builds numeric filter conditions for Prisma
 */
export function buildNumberFilter(field: string, operator: FilterOperator, value: any) {
  const numericValue = Number(value)

  switch (operator) {
    case 'equals':
      return {
        [field]: numericValue
      }

    case 'gt':
      return {
        [field]: {
          gt: numericValue
        }
      }

    case 'gte':
      return {
        [field]: {
          gte: numericValue
        }
      }

    case 'lt':
      return {
        [field]: {
          lt: numericValue
        }
      }

    case 'lte':
      return {
        [field]: {
          lte: numericValue
        }
      }

    case 'in':
      return {
        [field]: {
          in: Array.isArray(value) ? value.map(Number) : [numericValue]
        }
      }

    case 'notIn':
      return {
        [field]: {
          notIn: Array.isArray(value) ? value.map(Number) : [numericValue]
        }
      }

    default:
      throw new Error(`Unsupported number operator: ${operator}`)
  }
}

/**
 * Builds boolean filter conditions for Prisma
 */
export function buildBooleanFilter(field: string, operator: FilterOperator, value: any) {
  const booleanValue = Boolean(value)

  switch (operator) {
    case 'is':
      return {
        [field]: booleanValue
      }

    case 'isNot':
      return {
        [field]: !booleanValue
      }

    default:
      throw new Error(`Unsupported boolean operator: ${operator}`)
  }
}

/**
 * Builds enum filter conditions for Prisma
 */
export function buildEnumFilter(field: string, operator: FilterOperator, value: any) {
  switch (operator) {
    case 'equals':
      return {
        [field]: value
      }

    case 'in':
      return {
        [field]: {
          in: Array.isArray(value) ? value : [value]
        }
      }

    case 'notIn':
      return {
        [field]: {
          notIn: Array.isArray(value) ? value : [value]
        }
      }

    default:
      throw new Error(`Unsupported enum operator: ${operator}`)
  }
}
