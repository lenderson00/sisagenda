"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function Step3Items() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Adicionar Itens</h3>
        <p className="text-sm text-muted-foreground">
          Adicione os itens da entrega. Você pode adicionar o XML da NFe ou
          adicionar item a item.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name={`items.${index}.pi`}
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
            {/* Outros campos do item aqui, se necessário */}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ pi: "" })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Item
      </Button>
    </div>
  );
}
