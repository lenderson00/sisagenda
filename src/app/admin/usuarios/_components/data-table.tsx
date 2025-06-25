"use client";
import { DataTableFilter, useDataTableFilters } from "@/components/data-table";
import {
  createTSTColumns,
  createTSTFilters,
} from "@/components/data-table/integrations/tanstack-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { User } from "@prisma/client";
import { columnsConfig } from "./columns";
import { DataTable } from "@/components/data-table";
import { tstColumnsDefs } from "./tst-columns";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    handleActivate: (userId: string) => void;
    handleDeactivate: (userId: string) => void;
    handleDelete: (user: TData) => void;
    handleResetPassword?: (user: TData) => void;
  }
}

interface UsersDataTableProps {
  data: User[];
  handleActivate: (userId: string) => void;
  handleDeactivate: (userId: string) => void;
  handleDelete: (user: User) => void;
  handleResetPassword: (user: User) => void;
}

export function UsersDataTable({
  data,
  handleActivate,
  handleDeactivate,
  handleDelete,
  handleResetPassword,
}: UsersDataTableProps) {
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
      handleResetPassword,
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
      <DataTable table={table} actions={actions} />
    </div>
  );
}
