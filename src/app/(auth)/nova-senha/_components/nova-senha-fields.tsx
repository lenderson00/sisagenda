import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { NovaSenhaSchema } from "../_hooks/use-nova-senha-form";

interface NovaSenhaFieldsProps {
  form: UseFormReturn<NovaSenhaSchema>;
}

export function NovaSenhaFields({ form }: NovaSenhaFieldsProps) {
  return (
    <>
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
    </>
  );
}
