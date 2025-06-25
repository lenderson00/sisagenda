"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, MoreHorizontal, Trash, XCircle } from "lucide-react";
import type { Supplier } from "../page-client";

interface SupplierActionsProps {
  supplier: Supplier;
  onDeactivate: (supplierId: string) => void;
  onActivate: (supplierId: string) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierActions({
  supplier,
  onDeactivate,
  onActivate,
  onDelete,
}: SupplierActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supplier.isActive ? (
          <DropdownMenuItem
            onClick={() => onDeactivate(supplier.id)}
            className="text-yellow-600 focus:text-yellow-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Desativar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onActivate(supplier.id)}
            className="text-emerald-600 focus:text-emerald-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Ativar
          </DropdownMenuItem>
        )}
        {!supplier.isActive && (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(supplier)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
