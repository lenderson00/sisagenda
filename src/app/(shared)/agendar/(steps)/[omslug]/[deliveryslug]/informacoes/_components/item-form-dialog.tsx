"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const itemSchema = z.object({
  pi: z.string().optional(),
  name: z.string().min(1, "O nome do item é obrigatório."),
  unit: z.string().min(1, "A unidade é obrigatória."),
  quantity: z.coerce.number().min(1, "A quantidade deve ser no mínimo 1."),
  price: z.coerce.number().min(0.01, "O preço é obrigatório."),
});

export type Item = z.infer<typeof itemSchema>;

const unitOptions = [
  { value: "UN", label: "Unidade" },
  { value: "PC", label: "Peça" },
  { value: "CX", label: "Caixa" },
  { value: "KG", label: "Quilograma" },
  { value: "G", label: "Grama" },
  { value: "L", label: "Litro" },
  { value: "ML", label: "Mililitro" },
  { value: "M", label: "Metro" },
  { value: "M2", label: "Metro Quadrado" },
];

type ItemFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  defaultValues?: Item;
};

export function ItemFormDialog({
  isOpen,
  onClose,
  onSave,
  defaultValues,
}: ItemFormDialogProps) {
  const form = useForm<Item>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        defaultValues || {
          name: "",
          unit: "",
          quantity: 1,
          price: 0,
          pi: "",
        },
      );
    }
  }, [isOpen, defaultValues, form]);

  const onSubmit = (data: Item) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Editar Item" : "Adicionar Novo Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="pi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PI</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Identificador do item" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Item</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Parafuso Sextavado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Unitário</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
