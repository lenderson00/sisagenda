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
import { getStatusColor, getStatusReadableName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import { IconDots, IconEye } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  user: User;
  organization: Organization;
};

const columnHelper = createColumnHelper<AppointmentWithRelations>();

export const tstColumnsDefs = [
  // Status Column
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.status);
      return (
        <Link
          href={`/agendamentos/${row.original.id}`}
          className="hover:underline"
        >
          <Badge
            variant="outline"
            className={cn(
              "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit",
            )}
          >
            {getStatusReadableName(row.original.status)}
          </Badge>
        </Link>
      );
    },
  }),

  // Date Column
  columnHelper.accessor((row) => new Date(row.date), {
    id: "date",
    header: "Data de Agendamento",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}
      </div>
    ),
  }),

  // Organization Column
  columnHelper.accessor((row) => row.organization.name, {
    id: "organization",
    header: "Organização Militar",
    cell: ({ row }) => (
      <div className="text-sm min-w-[190px] truncate">
        {row.original.organization.name}
      </div>
    ),
  }),

  // Supplier Column
  columnHelper.accessor((row) => row.user.name, {
    id: "supplier",
    header: "Fornecedor",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {row.original.user.name || "Não informado"}
      </div>
    ),
  }),

  // Delivery Type Column
  columnHelper.accessor((row) => row.deliveryType.name, {
    id: "deliveryType",
    header: "Tipo de Entrega",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {row.original.deliveryType.name}
      </div>
    ),
  }),

  // Purchase Order Column
  columnHelper.accessor((row) => row.ordemDeCompra, {
    id: "ordemDeCompra",
    header: "Ordem de Compra",
    cell: ({ row }) => (
      <div className="text-sm min-w-[190px] truncate">
        {row.original.ordemDeCompra}
      </div>
    ),
  }),

  // Actions Column
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
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
              <IconEye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/agendamentos/${row.original.id}/edit`}>Editar</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];
