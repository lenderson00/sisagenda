import { userKeys } from "@/app/admin/configuracoes/usuario/_hooks/use-update-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type VerifyWhatsappTokenParams = {
  token: string;
};

export function useVerifyWhatsappToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VerifyWhatsappTokenParams) => {
      const response = await fetch("/api/whatsapp/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to verify code");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate user query to refetch data with verified whatsapp
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to verify code");
    },
  });
}
