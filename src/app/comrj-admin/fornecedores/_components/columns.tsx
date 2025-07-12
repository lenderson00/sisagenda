"use client";

import { Badge } from "@/components/ui/badge";
import type { Supplier } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { SupplierActions } from "./supplier-actions";

const columnHelper = createColumnHelper<Supplier>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("cnpj", {
    header: "CNPJ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("whatsapp", {
    header: "WhatsApp",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="default">Ativo</Badge>
      ) : (
        <Badge variant="destructive">Inativo</Badge>
      ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <SupplierActions supplier={row.original} />,
  }),
];
