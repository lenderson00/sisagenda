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
import type { Organization } from "@prisma/client";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { OrganizationForm } from "./organization-form";

type OrganizationWithComimsup = Organization & {
  comimsup: {
    name: string;
  };
};

interface EditOrganizationDialogProps {
  organization: OrganizationWithComimsup;
  children?: React.ReactNode;
}

export const EditOrganizationDialog = ({
  organization,
  children,
}: EditOrganizationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Transform the organization to match the form's expected type
  const formOrganization = {
    id: organization.id,
    name: organization.name,
    sigla: organization.sigla,
    description: organization.description,
    role: organization.role,
    isActive: organization.isActive,
    comimsupId: organization.comimsupId || "",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <IconPencil className="h-4 w-4" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPencil className="h-5 w-5" />
            Editar Organização
          </DialogTitle>
          <DialogDescription>
            Edite as informações da organização militar.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm
          organization={formOrganization}
          onSuccess={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
