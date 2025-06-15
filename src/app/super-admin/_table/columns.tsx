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
import type { Organization } from "@prisma/client";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, Trash2 } from "lucide-react";
import Link from "next/link";

type OrganizationResponse = Organization & {
  comimsup: {
    name: string;
  };
};

export const columns: ColumnDef<OrganizationResponse>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return (
        <Link href={`/${row.original.id}`}>
          <div className="text-sm min-w-[190px] truncate">
            {row.original.name}
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "sigla",
    header: "Sigla",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground w-[100px]">
          {row.original.sigla}
        </div>
      );
    },
  },
  {
    accessorKey: "comimsup",
    header: "COMIMSUP",
    cell: ({ row }) => {
      console.log(row.original);
      if (row.original?.comimsup?.name) {
        return (
          <div className="text-sm w-[100px] ">{row.original.comimsup.name}</div>
        );
      }

      return null;
    },
  },
  {
    accessorKey: "role",
    header: "Papel",
    cell: ({ row }) => {
      const name =
        row.original.role === "DEPOSITO" ? "Depósito" : row.original.role;

      return (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit"
        >
          {name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format(
        "D [de] MMMM [de] YYYY",
      );

      return <div className="text-sm w-[100px]">{date}</div>;
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
              <Link href={`/${row.original.id}`}>Ver Detalhes</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${row.original.id}`}>Editar</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
