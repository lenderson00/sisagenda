import { useQuery } from "@tanstack/react-query";
import { supplierKeys } from "./supplier-keys";
import { Supplier } from "@prisma/client";

export function useSuppliers(search?: string) {
  return useQuery<Supplier[]>({
    queryKey: supplierKeys.list(search || "all"),
    queryFn: async () => {
      const response = await fetch(
        `/api/suppliers${search ? `?search=${search}` : ""}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
      return response.json();
    },
  });
}
