/**
 * Builds a Prisma select object based on the provided columns
 * @param columns Array of column names to select
 * @returns Prisma select object
 */
export function buildSelect(columns: string[]) {
  if (!columns || columns.length === 0) {
    return undefined // Return all fields if no columns specified
  }

  // Create the select object with flexible typing
  const select: Record<string, any> = {}

  // Process each requested column
  for (const column of columns) {
    const trimmedColumn = column.trim()

    // Handle basic fields
    const basicFields = [
      'id', 'internalId', 'date', 'duration', 'ordemDeCompra',
      'notaFiscal', 'isFirstDelivery', 'processNumber', 'needsLabAnalysis',
      'observation', 'observations', 'status', 'createdAt', 'updatedAt',
      'deletedAt', 'userId', 'deliveryTypeId', 'organizationId'
    ]

    if (basicFields.includes(trimmedColumn)) {
      select[trimmedColumn] = true
      continue
    }

    // Handle relation includes
    if (trimmedColumn === 'user') {
      select.user = {
        select: {
          id: true,
          name: true,
          email: true,
          postoGraduacao: true,
          nip: true,
          cpf: true,
          isActive: true,
          role: true
        }
      }
      continue
    }

    if (trimmedColumn === 'deliveryType') {
      select.deliveryType = {
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          duration: true,
          isActive: true
        }
      }
      continue
    }

    if (trimmedColumn === 'organization') {
      select.organization = {
        select: {
          id: true,
          name: true,
          sigla: true,
          description: true,
          isActive: true,
          role: true
        }
      }
      continue
    }

    if (trimmedColumn === 'activities') {
      select.activities = {
        select: {
          id: true,
          type: true,
          title: true,
          content: true,
          previousStatus: true,
          newStatus: true,
          isInternal: true,
          isVisible: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
      continue
    }

    if (trimmedColumn === 'items') {
      select.items = {
        select: {
          id: true,
          pi: true,
          name: true,
          unit: true,
          quantity: true,
          price: true
        }
      }
      continue
    }

    if (trimmedColumn === 'attachments') {
      select.attachments = {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileSize: true,
          mimeType: true,
          createdAt: true
        }
      }
      continue
    }

    // If column is not recognized, skip it (or you could throw an error)
    console.warn(`Unknown column: ${trimmedColumn}`)
  }

  return Object.keys(select).length > 0 ? select : undefined
}
