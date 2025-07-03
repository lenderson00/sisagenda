"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  useCreateSupplier,
  useUpdateSupplier,
} from "../_hooks/supplier-mutations";

const supplierFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  address: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  organizationId: string;
  supplier?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnpj: string;
    address?: string;
  };
  prefillCnpj?: string;
  onSuccess?: () => void;
}

// CNPJ mask function
function applyCnpjMask(value: string): string {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, "");

  // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

// Function to remove mask for API calls
function removeCnpjMask(value: string): string {
  return value.replace(/\D/g, "");
}

export function SupplierForm({
  organizationId,
  supplier,
  prefillCnpj,
  onSuccess,
}: SupplierFormProps) {
  const createMutation = useCreateSupplier(organizationId);
  const updateMutation = useUpdateSupplier(organizationId);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      cnpj: supplier?.cnpj
        ? applyCnpjMask(supplier.cnpj)
        : prefillCnpj
          ? applyCnpjMask(prefillCnpj)
          : "",
      address: supplier?.address || "",
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      const formData = {
        ...data,
        cnpj: removeCnpjMask(data.cnpj), // Remove mask before sending to API
      };

      if (supplier) {
        await updateMutation.mutateAsync({
          id: supplier.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 md:px-0"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do fornecedor" {...field} />
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
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="00.000.000/0000-00"
                  {...field}
                  value={applyCnpjMask(field.value)}
                  onChange={(e) => {
                    const maskedValue = applyCnpjMask(e.target.value);
                    field.onChange(maskedValue);
                  }}
                  readOnly={!!prefillCnpj}
                  className={prefillCnpj ? "bg-gray-50" : ""}
                  maxLength={18}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Endereço completo"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Salvando..."
            : supplier
              ? "Atualizar"
              : "Criar"}
        </Button>
      </form>
    </Form>
  );
}
