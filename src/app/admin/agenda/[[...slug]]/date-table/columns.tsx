import { Badge } from "@/components/ui/badge";
import dayjs from "@/lib/dayjs";
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusReadableName } from "@/lib/utils";

export type AppointmentRow = Appointment & {
  deliveryType: DeliveryType;
  organization: Organization;
  user: User;
};

export const columns: ColumnDef<AppointmentRow>[] = [
  {
    accessorKey: "status",
    header: () => <div className="w-[100px]">Status</div>,
    cell: ({ row }) => (
      <Link
        href={`/agendamentos/${row.original.id}`}
        className="hover:underline"
      >
        {getStatusReadableName(row.original.status)}
      </Link>
    ),
  },
  {
    accessorKey: "date",
    header: "Agendamento",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {(() => {
            const hours = Math.floor(row.original.duration / 60);
            const minutes = row.original.duration % 60;

            const parts = [];
            if (hours > 0) parts.push(`${hours} h`);
            if (minutes > 0) parts.push(`${minutes} m`);

            return parts.join(" ") || "0m";
          })()}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "deliveryType",
    header: "Tipo de entrega",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {row.original.deliveryType.name}
      </div>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Fornecedor",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">{row.original.user.name}</div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
