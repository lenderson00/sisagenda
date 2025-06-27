"use client";

import { DataTableFilter, useDataTableFilters } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import {
  createTSTColumns,
  createTSTFilters,
} from "@/components/data-table/integrations/tanstack-table";
import type {
  Appointment,
  DeliveryType,
  User,
  Organization,
} from "@prisma/client";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { columnsConfig } from "./columns";
import { tstColumnsDefs } from "./tst-columns";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  user: User;
  organization: Organization;
};

interface AgendamentosDataTableProps {
  data: AppointmentWithRelations[];
}

export function AgendamentosDataTable({ data }: AgendamentosDataTableProps) {
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
