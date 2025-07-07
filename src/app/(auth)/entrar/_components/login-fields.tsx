import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form-skeleton";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { LoginSchema } from "../hooks/use-login-form";
import { maskCredential, cleanCredential } from "@/utils/maskCredential";

interface LoginFieldsProps {
  form: UseFormReturn<LoginSchema>;
}

export function LoginFields({ form }: LoginFieldsProps) {
  return (
    <>
      <FormField control={form.control} name="credential">
        {({ field }) => (
          <FormItem>
            <FormLabel>NIP ou CNPJ</FormLabel>
            <FormControl>
              <Input
                placeholder="Digite seu NIP ou CNPJ..."
                type="text"
                value={maskCredential(field.value || "")}
                onChange={(e) => {
                  const raw = cleanCredential(e.target.value);
                  field.onChange(raw);
                }}
                maxLength={18}
                autoComplete="username"
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
