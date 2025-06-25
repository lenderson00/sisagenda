"use client";
import { DataTableFilter, useDataTableFilters } from "@/components/data-table";
import {
  createTSTColumns,
  createTSTFilters,
} from "@/components/data-table/integrations/tanstack-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowData,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { Supplier } from "../page-client";
import { columnsConfig } from "./columns";
import { tstColumnsDefs } from "./tst-columns";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    handleActivate: (supplierId: string) => void;
    handleDeactivate: (supplierId: string) => void;
    handleDelete: (supplier: TData) => void;
  }
}

interface SuppliersDataTableProps {
  data: Supplier[];
  handleActivate: (supplierId: string) => void;
  handleDeactivate: (supplierId: string) => void;
  handleDelete: (supplier: Supplier) => void;
}

export function SuppliersDataTable({
  data,
  handleActivate,
  handleDeactivate,
  handleDelete,
}: SuppliersDataTableProps) {
  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: "client",
    data,
    columnsConfig,
  });

  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: tstColumnsDefs,
        configs: columns,
      }),
    [columns],
  );

  const tstFilters = useMemo(() => createTSTFilters(filters), [filters]);

  const table = useReactTable({
    data: data,
    columns: tstColumns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: tstFilters,
    },
    meta: {
      handleActivate,
      handleDeactivate,
      handleDelete,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center pb-4 gap-2">
        <DataTableFilter
          filters={filters}
          columns={columns}
          actions={actions}
          strategy={strategy}
          locale="pt"
        />
      </div>
      <div className="rounded-md border bg-white dark:bg-inherit">
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
                  className="h-12"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-12" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-[calc(var(--spacing)*12*10)]"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="text-2xl font-bold tracking-tight">
                      Nenhum resultado encontrado
                    </div>
                    <div className="text-muted-foreground">
                      Tente ajustar seus filtros de pesquisa
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
