import { organizationKeys } from "@/hooks/use-organization";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateOrganizationParams = {
  id: string;
  name?: string;
  sigla?: string;
  description?: string;
  comimsupId?: string | null;
  isActive?: boolean;
  lunchTimeStart?: number;
  lunchTimeEnd?: number;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update organization");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific organization query
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });
      // Also invalidate the organizations list
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update organization");
    },
  });
}
