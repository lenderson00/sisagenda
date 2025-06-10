"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/dialog-drawer";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SupplierForm } from "./supplier-form";

interface CreateSupplierDialogProps {
  orgId: string;
}

export function CreateSupplierDialog({ orgId }: CreateSupplierDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerDialog
      action="Adicionar Fornecedor"
      isOpen={open}
      setIsOpen={setOpen}
      title="Novo Fornecedor"
      description="Adicione um novo fornecedor para gerenciar suas operações."
    >
      <SupplierForm organizationId={orgId} onSuccess={() => setOpen(false)} />
    </DrawerDialog>
  );
}
