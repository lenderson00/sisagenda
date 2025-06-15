"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAdmin } from "../_hooks/use-create-admin";

const adminFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  email: z.string().email("Email inválido"),
  postoGraduacao: z.string().min(2, "Mínimo 2 letras"),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

interface AdminFormProps {
  organizationId: string;
}

export function AdminForm({ organizationId }: AdminFormProps) {
  const queryClient = useQueryClient();

  const createAdmin = useCreateAdmin();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      postoGraduacao: "",
    },
  });

  function onSubmit(values: AdminFormValues) {
    createAdmin.mutate(
      { ...values, organizationId },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["admins", organizationId],
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full px-4 md:px-0"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <FormField
            control={form.control}
            name="postoGraduacao"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Posto/Graduacao</FormLabel>
                <FormControl>
                  <Input placeholder="Posto/Graduacao" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome de Guerra</FormLabel>
                <FormControl>
                  <Input placeholder="Nome de Guerra do ADMIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email do ADMIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="submit"
            disabled={createAdmin.isPending}
            className="w-full"
          >
            {createAdmin.isPending ? "Criando..." : "Criar Administrador"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
