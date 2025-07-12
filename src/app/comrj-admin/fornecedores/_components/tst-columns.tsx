"use client";

import { Badge } from "@/components/ui/badge";
import type { Supplier } from "@prisma/client";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SupplierActions } from "./supplier-actions";

export const tstColumnsDefs: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "whatsapp",
    header: "WhatsApp",
    cell: (info: CellContext<Supplier, unknown>) =>
      (info.getValue() as string) || "N/A",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info: CellContext<Supplier, unknown>) => {
      const isActive = info.getValue() === "Ativo";
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {info.getValue() as string}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: (info: CellContext<Supplier, unknown>) => {
      const value = info.getValue();
      return value ? format(new Date(value as string), "dd/MM/yyyy") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="flex justify-end">
          <SupplierActions supplier={supplier} />
        </div>
      );
    },
  },
];
