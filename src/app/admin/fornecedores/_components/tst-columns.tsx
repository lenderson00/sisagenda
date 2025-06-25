"use client";
import { Badge } from "@/components/ui/badge";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Supplier } from "../page-client";
import { SupplierActions } from "./supplier-actions";

export const tstColumnsDefs: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: (info: CellContext<Supplier, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info: CellContext<Supplier, unknown>) => {
      const isActive = info.getValue() === "Ativo";
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
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
    cell: ({ row, table }) => {
      const supplier = row.original;
      const meta = table.options.meta as any;
      if (!meta) {
        return null;
      }
      return (
        <div className="flex justify-end">
          <SupplierActions
            supplier={supplier}
            onActivate={meta.handleActivate}
            onDeactivate={meta.handleDeactivate}
            onDelete={meta.handleDelete}
          />
        </div>
      );
    },
  },
];
