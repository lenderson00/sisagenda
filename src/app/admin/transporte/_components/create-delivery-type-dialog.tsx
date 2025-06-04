"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tipo de Transporte
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Criar Novo Tipo de Transporte
          </DialogTitle>
        </DialogHeader>
        <DeliveryTypeForm
          onSubmit={createDeliveryType}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
