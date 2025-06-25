import { DataTableFilter, useDataTableFilters } from "@/components/data-table";
import { columnsConfig } from "./columns";
import type { AppointmentWithRelations } from "../page-client";
import { useMemo, useEffect, type Dispatch, type SetStateAction } from "react";
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
import type {
  FiltersState,
  FilterModel,
} from "@/components/data-table/core/types";
import { useRouter } from "next/navigation";

interface DataTableTestProps {
  data: AppointmentWithRelations[];
  defaultStatusFilter?: string;
  filterState: {
    filter: FiltersState;
    setFilter: Dispatch<SetStateAction<FiltersState>>;
  };
}

export function DataTableTest({
  filterState,
  data,
  defaultStatusFilter,
}: DataTableTestProps) {
  const router = useRouter();

  // Set default status filter when component mounts or defaultStatusFilter changes
  useEffect(() => {
    if (defaultStatusFilter) {
      const statusFilter: FilterModel<"option"> = {
        columnId: "status",
        type: "option",
        operator: "is",
        values: [defaultStatusFilter],
      };
      filterState.setFilter([statusFilter]);
    }
  }, [defaultStatusFilter, filterState.setFilter]);

  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: "client",
    data,
    columnsConfig,
    filters: filterState.filter,
    onFiltersChange: (updatedFilters) => {
      // Handle both function and direct value cases
      const newFiltersValue =
        typeof updatedFilters === "function"
          ? updatedFilters(filterState.filter)
          : updatedFilters;

      filterState.setFilter(newFiltersValue);

      // Check if status filter was removed
      const hasStatusFilter = newFiltersValue.some(
        (filter: FilterModel<any>) => filter.columnId === "status",
      );
      if (!hasStatusFilter && defaultStatusFilter) {
        // Navigate to the base agenda page (no specific tab)
        router.push("/agenda");
      }
    },
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
