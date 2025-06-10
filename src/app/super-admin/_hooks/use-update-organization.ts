import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateOrganizationParams = {
  id: string;
  name?: string;
  sigla?: string;
  description?: string;
  role?: "COMIMSUP" | "DEPOSITO" | "COMRJ";
  isActive?: boolean;
};

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: UpdateOrganizationParams) => {
      const { id, ...data } = params;
      const response = await fetch(`/api/organizations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update organization");
    },
  });
}
