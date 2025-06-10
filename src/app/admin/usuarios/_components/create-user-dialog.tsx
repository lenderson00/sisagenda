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
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateUser } from "../_hooks/user-mutations";
import { UserForm } from "./user-form";

export const CreateUserDialog = ({ orgId }: { orgId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createUser } = useCreateUser(orgId, () => {
    setIsOpen(false);
  });

  return (
    <DrawerDialog
      title="Adicionar Militar"
      description="Adicione um novo militar a sua OM"
      action="Adicionar Militar"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <UserForm onSubmit={createUser} onCancel={() => setIsOpen(false)} />
    </DrawerDialog>
  );
};
