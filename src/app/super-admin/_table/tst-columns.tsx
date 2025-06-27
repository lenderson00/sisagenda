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
import { IconDots, IconEye, IconPencil } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { EditOrganizationDialog } from "../_components/edit-organization-dialog";

type OrganizationResponse = Organization & {
  comimsup: {
    name: string;
  };
};

const columnHelper = createColumnHelper<OrganizationResponse>();

export const tstColumnsDefs = [
  // Name Column
  columnHelper.accessor((row) => row.name, {
    id: "name",
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
  }),

  // Sigla Column
  columnHelper.accessor((row) => row.sigla, {
    id: "sigla",
    header: "Sigla",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground w-[100px]">
          {row.original.sigla}
        </div>
      );
    },
  }),

  // COMIMSUP Column
  columnHelper.accessor((row) => row.comimsup?.name, {
    id: "comimsup",
    header: "COMIMSUP",
    cell: ({ row }) => {
      if (row.original?.comimsup?.name) {
        return (
          <div className="text-sm w-[300px] truncate ">
            {row.original.comimsup.name}
          </div>
        );
      }
      return null;
    },
  }),

  // Role Column
  columnHelper.accessor((row) => row.role, {
    id: "role",
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
  }),

  // Created At Column
  columnHelper.accessor((row) => new Date(row.createdAt), {
    id: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format(
        "D [de] MMMM [de] YYYY",
      );

      return <div className="text-sm w-[100px]">{date}</div>;
    },
  }),

  // Actions Column
  columnHelper.display({
    id: "actions",
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
            <EditOrganizationDialog organization={row.original}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Editar
              </DropdownMenuItem>
            </EditOrganizationDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
