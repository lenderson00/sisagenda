"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword, signIn } from "@/lib/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

type FormSchema = z.infer<typeof schema>;

interface NovaSenhaFormProps {
  email: string;
}

export function NovaSenhaForm({ email }: NovaSenhaFormProps) {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    await resetPassword(values.password);
    toast.success("Senha alterada com sucesso!");
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-sm pb-2">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Defina uma nova senha</CardTitle>
        <CardDescription>Defina uma nova senha para sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="password"
              placeholder="Nova senha"
              {...form.register("password")}
              className={form.formState.errors.password ? "border-red-500" : ""}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
            <Input
              type="password"
              placeholder="Confirme a nova senha"
              {...form.register("confirmPassword")}
              className={
                form.formState.errors.confirmPassword ? "border-red-500" : ""
              }
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
