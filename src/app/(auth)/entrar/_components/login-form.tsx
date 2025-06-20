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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-skeleton";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
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

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
        <CardDescription>Faça login para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email">
              {({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu email..."
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </FormField>
            <FormField control={form.control} name="password">
              {({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha..."
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </FormField>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting && (
                <IconLoader className="mr-2 h-4 w-4 animate-spin" />
              )}
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
