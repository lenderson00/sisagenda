"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "@/lib/dayjs";
import { cn, getStatusColor, getStatusReadableName } from "@/lib/utils";
import type { Organization } from "@prisma/client";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AppointmentWithRelations } from "../page";
import { DataTableColumnHeader } from "./data-table-header";

export const columns: ColumnDef<AppointmentWithRelations>[] = [
  {
    accessorKey: "ordemDeCompra",
    header: "Ordem de Compra",
    cell: ({ row }) => {
      return (
        <Link href={`/agendamentos/${row.original.id}`}>
          <div className="text-sm min-w-[190px] truncate">
            {row.original.ordemDeCompra}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "organization",
    header: "Organização Militar",
    cell: ({ row }) => {
      return (
        <div className="text-sm w-[100px]">
          {row.original.organization?.name}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "deliveryType",
    header: "Tipo de Entrega",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground w-[100px]">
          {row.original.deliveryType.name}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm w-[100px] font-bold ">
          {dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.status);
      return (
        <Badge
          variant="outline"
          className={cn(
            "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit",
          )}
        >
          {getStatusReadableName(row.original.status)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <IconDots />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/agendamentos/${row.original.id}`}>
                Ver Detalhes
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
