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
      const response = await fetch(`/api/suppliers?organizationId=${organizationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      return response.json();
    },
  });
}

export function useSupplierStats(organizationId: string) {
  return useQuery<SupplierStats>({
    queryKey: supplierKeys.stats(organizationId),
    queryFn: async () => {
      const response = await fetch(`/api/suppliers/stats?organizationId=${organizationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch supplier stats");
      }
      return response.json();
    },
  });
}
