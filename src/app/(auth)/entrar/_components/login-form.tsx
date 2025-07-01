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
import { IconLoader } from "@tabler/icons-react";
import { useLoginForm } from "../hooks/use-login-form";
import { LoginFields } from "./login-fields";

export const LoginForm: React.FC = () => {
  const { form, onSubmit } = useLoginForm();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
        <CardDescription>Faça login para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LoginFields form={form} />
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
