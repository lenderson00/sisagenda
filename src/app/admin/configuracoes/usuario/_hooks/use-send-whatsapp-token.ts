import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type SendWhatsappTokenParams = {
  whatsapp: string;
};

export function useSendWhatsappToken() {
  return useMutation({
    mutationFn: async (params: SendWhatsappTokenParams) => {
      const response = await fetch("/api/whatsapp/send-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send verification code");
      }

      return response.json();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification code");
    },
  });
}
