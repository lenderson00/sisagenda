import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateOrganizationData = {
  name: string;
  sigla: string;
  description?: string;
  role: "COMIMSUP" | "DEPOSITO" | "COMRJ";
};

async function createOrganization(data: CreateOrganizationData) {
  const response = await fetch("/api/organizations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create organization");
  }

  return response.json();
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
    },
    onError: () => {
      toast.error("Failed to create organization");
    },
  });
}
