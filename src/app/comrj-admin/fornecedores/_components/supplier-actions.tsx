"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Supplier } from "@prisma/client";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { EditSupplierDialog } from "./edit-supplier-dialog";

interface SupplierActionsProps {
  supplier: Supplier;
}

export function SupplierActions({ supplier }: SupplierActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/comrj-admin/fornecedores/${supplier.id}`}>
            <IconEye className="mr-2 h-4 w-4" />
            <span>Ver Detalhes</span>
          </Link>
        </DropdownMenuItem>
        <EditSupplierDialog supplier={supplier}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <IconEdit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </DropdownMenuItem>
        </EditSupplierDialog>
        <DropdownMenuItem className="text-red-600">
          <IconTrash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
