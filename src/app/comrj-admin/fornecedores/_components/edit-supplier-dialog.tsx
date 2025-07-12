"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Supplier } from "@prisma/client";
import { useState } from "react";
import { useUpdateSupplier } from "../_hooks/supplier-mutations";
import { SupplierForm } from "./supplier-form";

interface EditSupplierDialogProps {
  supplier: Supplier;
  children: React.ReactNode;
}

export function EditSupplierDialog({
  supplier,
  children,
}: EditSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateSupplier, isPending } = useUpdateSupplier();

  const handleSubmit = (data: any) => {
    updateSupplier(
      { ...data, id: supplier.id },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
          <DialogDescription>
            Atualize os dados do fornecedor.
          </DialogDescription>
        </DialogHeader>
        <SupplierForm
          supplier={supplier}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
