"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "@/lib/dayjs";
import { cn, getStatusColor, getStatusReadableName } from "@/lib/utils";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { IconDots } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
  organization?: {
    name: string;
  };
};

export const tstColumnsDefs: ColumnDef<AppointmentWithRelations, any>[] = [
  {
    accessorFn: (row) => row.ordemDeCompra,
    id: "ordemDeCompra",
    header: "Ordem de Compra",
    cell: ({ row }) => {
      return (
        <Link href={`/agendamentos/${row.original.id}`}>
          <div className="text-sm min-w-[190px] truncate hover:underline">
            {row.original.ordemDeCompra}
          </div>
        </Link>
      );
    },
  },
  {
    accessorFn: (row) => row.organization?.name || "",
    id: "organization",
    header: "Organização Militar",
    cell: ({ row }) => {
      return (
        <div className="text-sm w-[100px]">
          {row.original.organization?.name}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.deliveryType.name,
    id: "deliveryType",
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
    accessorFn: (row) => row.date,
    id: "date",
    header: "Data",
    cell: ({ row }) => {
      return (
        <div className="text-sm w-[100px] font-bold">
          {dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
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
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
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
