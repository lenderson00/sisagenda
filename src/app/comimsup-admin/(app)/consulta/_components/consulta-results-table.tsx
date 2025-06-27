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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColor, getStatusReadableName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import { IconDots, IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";

interface ConsultaResultsTableProps {
  data: any[];
  queryType?: string;
}

export function ConsultaResultsTable({
  data,
  queryType,
}: ConsultaResultsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <IconEye className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum resultado encontrado</p>
      </div>
    );
  }

  // Get column headers from the first data item
  const columns = Object.keys(data[0] || {});

  const formatCellValue = (value: any, column: string) => {
    if (value === null || value === undefined) {
      return "-";
    }

    // Handle date formatting
    if (
      value instanceof Date ||
      (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/))
    ) {
      return dayjs(value).format("DD/MM/YYYY HH:mm");
    }

    // Handle status formatting
    if (column === "status" && typeof value === "string") {
      const statusColor = getStatusColor(value);
      return (
        <Badge
          variant="outline"
          className={cn(
            "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit",
          )}
        >
          {getStatusReadableName(value)}
        </Badge>
      );
    }

    // Handle boolean values
    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Sim" : "Não"}
        </Badge>
      );
    }

    // Handle nested objects
    if (typeof value === "object" && value !== null) {
      if (value.name) return value.name;
      if (value.email) return value.email;
      return JSON.stringify(value);
    }

    return value.toString();
  };

  const renderActions = (row: any, index: number) => {
    if (queryType === "appointments" && row.id) {
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
              <Link href={`/agendamentos/${row.id}`}>
                <IconEye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/agendamentos/${row.id}/edit`}>Editar</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {data.length} registro(s) encontrado(s)
        </div>
        <Button variant="outline" size="sm">
          <IconDownload className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="capitalize">
                  {column === "internalId"
                    ? "ID Interno"
                    : column === "ordemDeCompra"
                      ? "Ordem de Compra"
                      : column === "postoGraduacao"
                        ? "Posto/Graduação"
                        : column === "isActive"
                          ? "Ativo"
                          : column === "createdAt"
                            ? "Criado em"
                            : column === "updatedAt"
                              ? "Atualizado em"
                              : column === "deliveryType"
                                ? "Tipo de Entrega"
                                : column === "organization"
                                  ? "Organização"
                                  : column === "user"
                                    ? "Usuário"
                                    : column === "militares"
                                      ? "Militares"
                                      : column === "deliveryTypes"
                                        ? "Tipos de Entrega"
                                        : column === "appointments"
                                          ? "Agendamentos"
                                          : column}
                </TableHead>
              ))}
              <TableHead className="w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {formatCellValue(row[column], column)}
                  </TableCell>
                ))}
                <TableCell>{renderActions(row, index)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
