import { useQuery } from "@tanstack/react-query";
import { supplierKeys } from "./supplier-keys";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: {
    id: string;
    name: string;
    sigla: string;
  };
  status?: string;
  cnpj?: string;
}

interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
}

export function useSuppliers(organizationId: string) {
  return useQuery<Supplier[]>({
    queryKey: supplierKeys.list(organizationId),
    queryFn: async () => {
      const response = await fetch(
        `/api/suppliers?organizationId=${organizationId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      const data = await response.json();

      // Transform the data to match the expected format
      return data.map((supplier: any) => ({
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.whatsapp,
        cnpj: supplier.cnpj,
        address: supplier.address,
        isActive: supplier.isActive,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
        organization: supplier.organization,
        status: supplier.status,
      }));
    },
  });
}

export function useSupplierStats(organizationId: string) {
  return useQuery<SupplierStats>({
    queryKey: supplierKeys.stats(organizationId),
    queryFn: async () => {
      const response = await fetch(
        `/api/suppliers/stats?organizationId=${organizationId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supplier stats");
      }
      return response.json();
    },
  });
}

export function useSearchSupplierByCnpj(cnpj: string) {
  return useQuery<Supplier | null>({
    queryKey: supplierKeys.searchByCnpj(cnpj),
    queryFn: async () => {
      if (!cnpj.trim()) return null;
      const response = await fetch(
        `/api/suppliers/search?cnpj=${encodeURIComponent(cnpj)}`,
      );
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to search supplier");
      }
      return response.json();
    },
    enabled: !!cnpj.trim(),
  });
}
