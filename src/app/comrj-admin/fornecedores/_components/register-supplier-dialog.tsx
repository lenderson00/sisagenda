"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useCreateSupplier } from "../_hooks/supplier-mutations";
import { SupplierForm } from "./supplier-form";

export function RegisterSupplierDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createSupplier, isPending } = useCreateSupplier();

  const handleSubmit = (data: any) => {
    createSupplier(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Fornecedor</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo fornecedor no sistema.
          </DialogDescription>
        </DialogHeader>
        <SupplierForm onSubmit={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
