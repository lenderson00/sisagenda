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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateDeliveryType } from "../_hooks/delivery-type-mutations";
import { DeliveryTypeForm } from "./delivery-type-form";

export const CreateDeliveryTypeDialog = ({ orgId }: { orgId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutate: createDeliveryType } = useCreateDeliveryType(orgId, () => {
    setIsOpen(false);
    router.refresh();
  });

  return (
    <DrawerDialog
      title="Adicionar Tipo de Entrega"
      description="Crie um novo tipo de entrega para as empresas agendarem horários."
      action="Adicionar Tipo de Entrega"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <DeliveryTypeForm
        onSubmit={createDeliveryType}
        onCancel={() => setIsOpen(false)}
      />
    </DrawerDialog>
  );
};
