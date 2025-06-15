import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateAdminData = {
  name: string;
  email: string;
  postoGraduacao: string;
  organizationId: string;
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
    throw new Error("Failed to create admin");
  }

  return response.json();
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Administrador criado com sucesso");
    },
    onError: () => {
      toast.error("Falha ao criar administrador");
    },
  });
}
