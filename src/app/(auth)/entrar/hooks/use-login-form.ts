import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/actions/auth";

import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginSchema) {
    const { email, password } = values;
    try {
      const result = await signIn({ email, password });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      if (error.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("NEXT_AUTH_ERROR", error);
      toast.error("Ocorreu um erro inesperado.");
    }
  }

  return { form, onSubmit };
}
