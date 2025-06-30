import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useState } from "react";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial",
      )
      .max(30, "A senha não pode ter mais de 30 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type NovaSenhaSchema = z.infer<typeof schema>;

export function useNovaSenhaForm(email: string) {
  const form = useForm<NovaSenhaSchema>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: NovaSenhaSchema) {
    setLoading(true);
    await resetPassword(values.password);
    toast.success("Senha alterada com sucesso!");
    setLoading(false);
  }

  return { form, onSubmit, loading };
}
