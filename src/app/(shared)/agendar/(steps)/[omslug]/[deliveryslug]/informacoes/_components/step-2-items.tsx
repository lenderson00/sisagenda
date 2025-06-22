"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ItemFormDialog, type Item } from "./item-form-dialog";

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

export function Step2Items() {
  const form = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    setEditingItemIndex(null);
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingItemIndex(index);
    setDialogOpen(true);
  };

  const handleSave = (item: Item) => {
    if (editingItemIndex !== null) {
      update(editingItemIndex, item);
    } else {
      append(item);
    }
    setDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <ItemFormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        // @ts-expect-error - TODO: fix this
        defaultValues={
          editingItemIndex !== null ? fields[editingItemIndex] : undefined
        }
      />
      <div>
        <h3 className="text-lg font-medium">Itens da Entrega</h3>
        <p className="text-sm text-muted-foreground">
          Adicione os itens da sua entrega.
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PI</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const item = form.watch(`items.${index}`);
              return (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{item.pi}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={handleAddNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Item
      </Button>
    </div>
  );
}
