"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { User } from "@prisma/client";
import { useForm } from "react-hook-form";

type UserData = {
  name: string;
  email: string;
  whatsapp: string;
};

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: UserData) => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-4 md:px-0"
      >
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Nome Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo"
                    {...field}
                    className="border-muted"
                  />
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
                <FormLabel className="text-gray-900">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Digite o email"
                    {...field}
                    className="border-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o número de WhatsApp"
                    {...field}
                    className="border-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {!isMobile && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-muted text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white w-full md:w-auto"
          >
            {initialData ? "Atualizar" : "Adicionar Militar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
