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
} from "@tanstack/react-table";
import { useMemo } from "react";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import { columnsConfig } from "./columns";
import { DataTable } from "@/components/data-table";
import { tstColumnsDefs } from "./tst-columns";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
  organization?: {
    name: string;
  };
};

interface AgendaDataTableProps {
  data: AppointmentWithRelations[];
}

export function AgendaDataTable({ data }: AgendaDataTableProps) {
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
