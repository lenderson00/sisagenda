"use client";

import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

type MobileItemCardProps = {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  onEdit: () => void;
  onRemove: () => void;
};

export function MobileItemCard({
  name,
  quantity,
  unit,
  price,
  onEdit,
  onRemove,
}: MobileItemCardProps) {
  const total = quantity * price;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex-1 space-y-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {quantity} {unit} x {formatCurrency(price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{formatCurrency(total)}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onRemove} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
