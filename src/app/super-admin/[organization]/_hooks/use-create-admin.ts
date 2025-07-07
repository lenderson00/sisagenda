import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateAdminData = {
  name: string;
  email: string;
  postoGraduacao: string;
  organizationId: string;
  nip: string;
  image?: string;
};

async function createAdmin(data: CreateAdminData) {
  const response = await fetch(
    `/api/organizations/${data.organizationId}/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Falha ao criar administrador");
  }

  return response.json();
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
