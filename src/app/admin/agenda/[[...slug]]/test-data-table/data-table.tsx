import { DataTableFilter, useDataTableFilters } from "@/components/data-table";
import { columnsConfig } from "./columns";
import type { AppointmentWithRelations } from "../page-client";
import { useMemo, useState } from "react";
import {
  createTSTColumns,
  createTSTFilters,
} from "@/components/data-table/integrations/tanstack-table";
import { DataTable } from "./table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { tstColumnsDefs } from "./tst-columns";
import type { FiltersState } from "@/components/data-table/core/types";

export function DataTableTest({ data }: { data: AppointmentWithRelations[] }) {
  const [newFilters, setNewFilters] = useState<FiltersState>([]);

  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: "client",
    data,
    columnsConfig,
    filters: newFilters,
    onFiltersChange: setNewFilters,
  });

  console.log(filters);

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
    <div className="w-full col-span-2">
      <div className="flex items-center pb-4 gap-2">
        <DataTableFilter
          filters={filters}
          columns={columns}
          actions={actions}
          strategy={strategy}
          locale="pt"
        />
      </div>
      <DataTable table={table} />
    </div>
  );
}
