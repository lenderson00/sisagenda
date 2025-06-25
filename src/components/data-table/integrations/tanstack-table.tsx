import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import type { Column, FilterModel, FiltersState } from "../core/types";
import { multiOptionFilterFn, optionFilterFn } from "../lib/filter-fns";
import { dateFilterFn, numberFilterFn, textFilterFn } from "../lib/filter-fns";
import {
  isColumnOption,
  isColumnOptionArray,
  isStringArray,
} from "../lib/helpers";

interface CreateTSTColumns<TData> {
  columns: ColumnDef<TData, any>[];
  configs: Column<TData>[];
}

export function createTSTColumns<TData>({
  columns,
  configs,
}: CreateTSTColumns<TData>) {
  const _cols: ColumnDef<TData>[] = [];

  for (const col of columns) {
    // Get the column filter config for this column
    const config = configs.find((c) => c.id === col.id);

    // If the column is not filterable or doesn't have a filter config, skip it
    // An explicit check is done on `enableColumnFilter`
    if (col.enableColumnFilter === false || !config) {
      _cols.push(col);
      continue;
    }

    if (config.type === "text") {
      col.filterFn = textFilterFn as unknown as FilterFn<TData>;
      _cols.push(col);
      continue;
    }

    if (config.type === "number") {
      col.filterFn = numberFilterFn as unknown as FilterFn<TData>;
      _cols.push(col);
      continue;
    }

    if (config.type === "date") {
      col.filterFn = (row, columnId, filterValue: FilterModel<"date">) => {
        const value = row.getValue<unknown>(columnId);

        if (!value) return false;

        // Ensure we have a Date object
        let dateValue: Date;
        if (value instanceof Date) {
          dateValue = value;
        } else if (typeof value === "string") {
          dateValue = new Date(value);
        } else {
          // If it's not a Date or string, try to convert it
          dateValue = new Date(value as any);
        }

        // Check if the date is valid
        if (Number.isNaN(dateValue.getTime())) {
          return false;
        }

        return dateFilterFn(dateValue, filterValue);
      };
      _cols.push(col);
      continue;
    }

    if (config.type === "option") {
      col.filterFn = (row, columnId, filterValue: FilterModel<"option">) => {
        const value = row.getValue<unknown>(columnId);

        if (!value) return false;

        if (typeof value === "string") {
          return optionFilterFn(value, filterValue);
        }

        if (isColumnOption(value)) {
          return optionFilterFn(value.value, filterValue);
        }

        if (config.transformOptionFn) {
          const sanitizedValue = config.transformOptionFn(value as never);
          return optionFilterFn(sanitizedValue.value, filterValue);
        }

        return false;
      };
    }

    if (config.type === "multiOption") {
      col.filterFn = (
        row,
        columnId,
        filterValue: FilterModel<"multiOption">,
      ) => {
        const value = row.getValue(columnId);

        if (!value) return false;

        if (isStringArray(value)) {
          return multiOptionFilterFn(value, filterValue);
        }

        if (isColumnOptionArray(value)) {
          return multiOptionFilterFn(
            value.map((v) => v.value),
            filterValue,
          );
        }

        // Handle case where value might not be an array
        if (Array.isArray(value)) {
          if (config.transformOptionFn) {
            const sanitizedValue = value.map((v) => {
              if (config.transformOptionFn) {
                return config.transformOptionFn(v);
              }
              return { value: v };
            });

            return multiOptionFilterFn(
              sanitizedValue.map((v) => v.value),
              filterValue,
            );
          }
          return false;
        }

        // If value is not an array, treat it as a single value
        if (config.transformOptionFn) {
          const sanitizedValue = config.transformOptionFn(value as never);
          return multiOptionFilterFn([sanitizedValue.value], filterValue);
        }

        return false;
      };
    }

    _cols.push(col);
  }

  return _cols;
}

export function createTSTFilters(filters: FiltersState): ColumnFiltersState {
  return filters.map((filter) => ({ id: filter.columnId, value: filter }));
}
