"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { FilterCondition } from "@/lib/query/types";

// Default columns for appointments
const DEFAULT_COLUMNS = [
  "id",
  "internalId",
  "date",
  "status",
  "ordemDeCompra",
  "user",
  "organization",
];

interface FilterContextProps {
  filters: FilterCondition[];
  setFilters: (filters: FilterCondition[]) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  limit: number;
  setLimit: (limit: number) => void;
  executeQuery: () => void;
  clearConfiguration: () => void;
  loadConfiguration: () => void;
  isLoaded: boolean;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedColumns, setSelectedColumns] =
    useState<string[]>(DEFAULT_COLUMNS);
  const [limit, setLimit] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveConfiguration = useCallback(() => {
    if (!isLoaded) return; // Prevent saving initial default state
    const config = {
      filters,
      selectedColumns,
      limit,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("consulta-config", JSON.stringify(config));
  }, [filters, selectedColumns, limit, isLoaded]);

  const loadConfiguration = useCallback(() => {
    const savedConfig = localStorage.getItem("consulta-config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setFilters(config.filters || []);
        setSelectedColumns(config.selectedColumns || DEFAULT_COLUMNS);
        setLimit(config.limit || 50);
      } catch (error) {
        console.error("Error loading saved configuration:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const clearConfiguration = () => {
    setFilters([]);
    setSelectedColumns(DEFAULT_COLUMNS);
    setLimit(50);
    localStorage.removeItem("consulta-config");
  };

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  useEffect(() => {
    saveConfiguration();
  }, [saveConfiguration]);

  const executeQuery = () => {
    saveConfiguration();
    router.push("/comimsup-admin/consulta/resultados");
  };

  const value = {
    filters,
    setFilters,
    selectedColumns,
    setSelectedColumns,
    limit,
    setLimit,
    executeQuery,
    clearConfiguration,
    loadConfiguration,
    isLoaded,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error(
      "useFilterContext must be used within a FilterContextProvider",
    );
  }
  return context;
}
