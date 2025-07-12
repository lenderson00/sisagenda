"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { IconDots, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import type { OrganizationWithStats } from "./columns";

export const tstColumnsDefs: ColumnDef<OrganizationWithStats>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => {
      const org = info.row.original;
      return (
        <div>
          <p className="font-medium">{info.getValue() as string}</p>
          <p className="text-sm text-muted-foreground">{org.sigla}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "sigla",
    header: "Sigla",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => (
      <Badge variant="outline" className="font-mono">
        {info.getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => (
      <div className="max-w-xs">
        <p className="text-sm text-muted-foreground truncate">
          {(info.getValue() as string) || "Sem descrição"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "totalAppointments",
    header: "Total de Agendamentos",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => (
      <div className="text-center">
        <span className="text-lg font-semibold">
          {info.getValue() as number}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "completedAppointments",
    header: "Agendamentos Concluídos",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => {
      const completed = info.getValue() as number;
      return (
        <div className="text-center">
          <Badge variant="default" className="bg-green-100 text-green-800">
            {completed}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "pendingAppointments",
    header: "Agendamentos Pendentes",
    cell: (info: CellContext<OrganizationWithStats, unknown>) => {
      const pending = info.getValue() as number;
      return (
        <div className="text-center">
          <Badge variant={pending > 0 ? "destructive" : "secondary"}>
            {pending}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const organization = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/comrj-admin/organizacoes/${organization.id}`}>
                  <IconEye className="mr-2 h-4 w-4" />
                  <span>Ver Detalhes</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
