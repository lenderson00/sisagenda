'use client'

import { useQuery } from '@tanstack/react-query'

interface Organization {
  id: string
  name: string
  sigla: string
}

interface DeliveryType {
  id: string
  name: string
  slug: string
}

async function getOrganizationBySlug(slug: string): Promise<Organization> {
  const response = await fetch(`/api/organizations/by-slug/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch organization')
  }
  return response.json()
}

async function getDeliveryTypeBySlug(slug: string): Promise<DeliveryType> {
  const response = await fetch(`/api/delivery-types/by-slug/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch delivery type')
  }
  return response.json()
}

export function useScheduleData(orgSlug?: string, deliverySlug?: string) {
  const {
    data: organization,
    isLoading: isOrgLoading,
    isError: isOrgError,
  } = useQuery({
    queryKey: ['organization', orgSlug],
    queryFn: () => getOrganizationBySlug(orgSlug || ''),
    enabled: !!orgSlug,
  })

  const {
    data: deliveryType,
    isLoading: isDeliveryLoading,
    isError: isDeliveryError,
  } = useQuery({
    queryKey: ['deliveryType', deliverySlug],
    queryFn: () => getDeliveryTypeBySlug(deliverySlug || ''),
    enabled: !!deliverySlug,
  })

  return {
    organization,
    deliveryType,
    isLoading: isOrgLoading || isDeliveryLoading,
    isError: isOrgError || isDeliveryError,
  }
}
