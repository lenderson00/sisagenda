"use client";

import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  FormControl,
  FormField,
  FormItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatCurrency } from "@/lib/utils";

import type { DetailsFormValues } from "./details-form";
import { Step2ItemForm } from "./step-2-item-form";
import { MobileItemCard } from "./step-2-mobile-item-card";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useFormContext<DetailsFormValues>();
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");
  const grandTotal = items?.reduce((total, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return total + itemTotal;
  }, 0);

  function handleAddNew() {
    append({ name: "", unit: "UN", quantity: 1, price: 0 });
    if (!isDesktop) {
      setEditingIndex(fields.length);
      setIsDrawerOpen(true);
    }
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setIsDrawerOpen(true);
  }

  function handleDrawerClose() {
    setIsDrawerOpen(false);
    setEditingIndex(null);
  }

  if (isDesktop) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Itens da Entrega</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Nome do Item</TableHead>
              <TableHead className="w-[15%]">Unidade</TableHead>
              <TableHead className="w-[15%]">Quantidade</TableHead>
              <TableHead className="w-[15%]">Valor Unitário</TableHead>
              <TableHead className="w-[15%] text-right">Total</TableHead>
              <TableHead className="w-[5%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const quantity = items?.[index]?.quantity || 0;
              const price = items?.[index]?.price || 0;
              const itemTotal = quantity * price;
              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Nome do item" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(itemTotal)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Geral</TableCell>
              <TableCell className="text-right">
                {formatCurrency(grandTotal || 0)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddNew}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Itens da Entrega</h2>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <MobileItemCard
            key={field.id}
            name={items?.[index]?.name || ""}
            quantity={items?.[index]?.quantity || 0}
            unit={items?.[index]?.unit || ""}
            price={items?.[index]?.price || 0}
            onEdit={() => handleEdit(index)}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleAddNew}
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar Item
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {editingIndex !== null ? "Editar Item" : "Adicionar Item"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            {editingIndex !== null && <Step2ItemForm index={editingIndex} />}
          </div>
          <Button onClick={handleDrawerClose} className="m-4">
            Concluído
          </Button>
        </DrawerContent>
      </Drawer>
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-lg font-semibold">Total Geral</p>
        <p className="text-lg font-semibold">
          {formatCurrency(grandTotal || 0)}
        </p>
      </div>
    </div>
  );
}
