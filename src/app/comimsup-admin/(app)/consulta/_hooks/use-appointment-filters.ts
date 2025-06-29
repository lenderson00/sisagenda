"use client";

import { useQuery } from "@tanstack/react-query";
import type { FilterCondition } from "@/lib/query/types";

interface AppointmentFilters {
  filters: FilterCondition[];
  columns: string[];
  limit?: number;
  cursor?: string;
}

interface AppointmentResponse {
  data: any[];
  pagination: {
    hasNextPage: boolean;
    nextCursor: string | null;
    limit: number;
  };
}

async function fetchAppointmentData(filters: AppointmentFilters): Promise<AppointmentResponse> {
  const params = new URLSearchParams();

  if (filters.filters.length > 0) {
    params.append("filters", JSON.stringify(filters.filters));
  }

  if (filters.columns.length > 0) {
    params.append("columns", filters.columns.join(","));
  }

  if (filters.limit) {
    params.append("limit", filters.limit.toString());
  }

  if (filters.cursor) {
    params.append("cursor", filters.cursor);
  }

  const response = await fetch(`/api/query?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch appointment data");
  }

  return response.json();
}

export function useAppointmentFilters(filters: AppointmentFilters, enabled = true) {
  return useQuery({
    queryKey: ["appointment-filters", filters],
    queryFn: () => fetchAppointmentData(filters),
    enabled,
  });
}
