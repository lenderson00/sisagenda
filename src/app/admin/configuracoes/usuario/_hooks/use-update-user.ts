import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

type UpdateUserParams = {
  id: string;
  name?: string;
  email?: string;
  nip?: string;
  cpf?: string;
  whatsapp?: string;
  postoGraduacao?:
    | "GM"
    | "VA"
    | "CA"
    | "CMG"
    | "CF"
    | "CC"
    | "CT"
    | "SO"
    | "SG"
    | "CB"
    | "MN"
    | null;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateUserParams) => {
      const { id, ...data } = params;
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
