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
import { useCreateAvailability } from "../_hooks/availability-mutations";
import { AvailabilityForm } from "./availability-form";

export const CreateAvailabilityDialog = ({ orgId }: { orgId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutate: createAvailability } = useCreateAvailability(orgId, () => {
    setIsOpen(false);
    router.refresh();
  });

  return (
    <DrawerDialog
      title="Adicionar Disponibilidade"
      description="Crie uma nova disponibilidade para as empresas agendarem horários."
      action="Adicionar Disponibilidade"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <AvailabilityForm
        onSubmit={createAvailability}
        onCancel={() => setIsOpen(false)}
      />
    </DrawerDialog>
  );
};
