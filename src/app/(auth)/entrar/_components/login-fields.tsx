import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form-skeleton";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { LoginSchema } from "../hooks/use-login-form";

interface LoginFieldsProps {
  form: UseFormReturn<LoginSchema>;
}

export function LoginFields({ form }: LoginFieldsProps) {
  return (
    <>
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
    </>
  );
}
