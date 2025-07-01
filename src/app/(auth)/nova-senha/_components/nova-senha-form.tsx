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
import { useNovaSenhaForm } from "../_hooks/use-nova-senha-form";
import { NovaSenhaFields } from "./nova-senha-fields";

interface NovaSenhaFormProps {
  email: string;
}

export function NovaSenhaForm({ email }: NovaSenhaFormProps) {
  const { form, onSubmit, loading } = useNovaSenhaForm(email);

  return (
    <Card className="w-full max-w-sm ">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Defina uma nova senha</CardTitle>
        <CardDescription>Defina uma nova senha para sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <NovaSenhaFields form={form} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
