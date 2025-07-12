import { useQuery } from "@tanstack/react-query";
import { supplierKeys } from "./supplier-keys";
import type { Supplier } from "@prisma/client";

export function useSuppliers(search?: string) {
  return useQuery<Supplier[]>({
    queryKey: supplierKeys.list(search || "all"),
    queryFn: async () => {
      const response = await fetch(
        `/api/suppliers${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch suppliers");
      }
      return response.json();
    },
  });
}
