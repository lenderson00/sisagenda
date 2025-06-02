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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAdmin } from "../_hooks/use-create-admin";

const adminFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  email: z.string().email("Email inválido"),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

interface AdminFormProps {
  organizationId: string;
  onSuccess: () => void;
}

export function AdminForm({ organizationId, onSuccess }: AdminFormProps) {
  const createAdmin = useCreateAdmin();
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: AdminFormValues) {
    createAdmin.mutate(
      { ...values, organizationId },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do administrador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email do administrador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={createAdmin.isPending}>
            {createAdmin.isPending ? "Criando..." : "Criar Administrador"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
