"use client";

import { useQuery } from "@tanstack/react-query";

interface FilterConfig {
  fields: Record<string, {
    type: string;
    operators: string[];
    label: string;
    options?: Array<{ value: string; label: string }>;
  }>;
}

async function fetchFilterConfig(): Promise<FilterConfig> {
  const response = await fetch("/api/query/filters");

  if (!response.ok) {
    throw new Error("Failed to fetch filter configuration");
  }

  const result = await response.json();
  return result.data;
}

export function useFilterConfig() {
  return useQuery({
    queryKey: ["filter-config"],
    queryFn: fetchFilterConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
