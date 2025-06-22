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
import { useMediaQuery } from "@/hooks/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

interface DeliveryTypeFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: FormData;
}

export function AvailabilityForm({
  onSubmit,
  onCancel,
  initialData,
}: DeliveryTypeFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full px-4 md:px-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            form.handleSubmit(handleSubmit)();
          }
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex.: Horário padrão de atendimento"
                  {...field}
                  className="border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {!isMobile && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white w-full md:w-auto"
          >
            {initialData
              ? "Atualizar Disponibilidade"
              : "Criar Disponibilidade"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
