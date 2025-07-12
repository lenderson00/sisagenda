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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Organization } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  IconDots,
  IconEye,
  IconBuilding,
  IconBuildingStore,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import Link from "next/link";

interface OrganizationsDataTableProps {
  data: Organization[];
}

const columnHelper = createColumnHelper<Organization>();

const getRoleIcon = (role: string) => {
  switch (role) {
    case "COMRJ":
      return <IconBuildingStore className="h-4 w-4" />;
    case "DEPOSITO":
      return <IconBuildingWarehouse className="h-4 w-4" />;
    case "COMIMSUP":
      return <IconBuilding className="h-4 w-4" />;
    default:
      return <IconBuilding className="h-4 w-4" />;
  }
};

const getRoleBadge = (role: string) => {
  const roleMap: Record<
    string,
    { variant: "default" | "secondary" | "outline"; label: string }
  > = {
    COMRJ: { variant: "default", label: "COMRJ" },
    DEPOSITO: { variant: "secondary", label: "Depósito" },
    COMIMSUP: { variant: "outline", label: "COMIMSUP" },
  };

  const roleInfo = roleMap[role] || {
    variant: "outline" as const,
    label: role,
  };
  return (
    <Badge variant={roleInfo.variant} className="flex items-center gap-1">
      {getRoleIcon(role)}
      {roleInfo.label}
    </Badge>
  );
};

const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => (
      <div>
        <p className="font-medium">{info.getValue()}</p>
        <p className="text-sm text-muted-foreground">
          {info.row.original.sigla}
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("sigla", {
    header: "Sigla",
    cell: (info) => (
      <Badge variant="outline" className="font-mono">
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Tipo",
    cell: (info) => getRoleBadge(info.getValue()),
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) => (
      <Badge variant={info.getValue() ? "default" : "destructive"}>
        {info.getValue() ? "Ativa" : "Inativa"}
      </Badge>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const organization = row.original;
      return (
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
      );
    },
  }),
];

export function OrganizationsDataTable({ data }: OrganizationsDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhuma organização encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
