"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./organization-form";

export function CreateOrganizationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
        </DialogHeader>
        <OrganizationForm />
      </DialogContent>
    </Dialog>
  );
}
