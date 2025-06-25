"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { EmptyScreen } from "./_components/empty-screen";
import { IconFilter } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
import { DataTableTest } from "./test-data-table/data-table";
import type { FiltersState } from "@/components/data-table/core/types";
import { useState } from "react";

const AvailableTabs = [
  {
    label: "Pendentes de ação",
    href: "/admin/agenda",
    slug: "pendentes",
    statusFilter: "PENDING_CONFIRMATION",
  },
  {
    label: "Próximos",
    href: "/admin/agenda/proximos",
    slug: "proximos",
    statusFilter: "CONFIRMED",
  },
  {
    label: "Cancelados",
    href: "/admin/agenda/cancelados",
    slug: "cancelados",
    statusFilter: "CANCELLED",
  },
  {
    label: "Anteriores",
    href: "/admin/agenda/anteriores",
    slug: "anteriores",
    statusFilter: "COMPLETED",
  },
  {
    label: "Concluídos",
    href: "/admin/agenda/concluidos",
    slug: "concluidos",
    statusFilter: "COMPLETED",
  },
];

export type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  organization: Organization;
  user: User;
};

const getAppointments = async (): Promise<AppointmentWithRelations[]> => {
  const response = await fetch("/api/appointments");
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
};

const DataTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="w-full text-sm">
          <div className="border-b">
            <div className="flex h-12 items-center px-4">
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
          <div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex h-12 items-center border-b px-4">
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function PageClient({ slug }: { slug?: string[] }) {
  const tab = slug?.[0] || "pendentes";
  const currentTab =
    AvailableTabs.find((t) => t.slug === tab) || AvailableTabs[0];
  const [newFilters, setNewFilters] = useState<FiltersState>([]);

  const { data, isLoading, isError, error } = useQuery<
    AppointmentWithRelations[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return (
    <div className="space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex divide-x overflow-hidden rounded-md border">
            {AvailableTabs.map((mapTab) => (
              <Link
                key={mapTab.href}
                href={mapTab.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  tab === mapTab.slug
                    ? tab === "pendentes" && newFilters.length === 0
                      ? "hover:bg-muted"
                      : "bg-muted text-muted-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {mapTab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <DataTableSkeleton />}
      {!isLoading && !isError && data && (
        <DataTableTest
          data={data}
          filterState={{
            filter: newFilters,
            setFilter: setNewFilters,
          }}
          defaultStatusFilter={currentTab.statusFilter}
        />
      )}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyScreen
          Icon={IconFilter}
          headline="Nenhuma reserva encontrada"
          description="Não há reservas que correspondam aos filtros selecionados."
        />
      )}
      {isError && (
        <EmptyScreen
          headline="Erro ao carregar as reservas"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro desconhecido."
          }
        />
      )}
    </div>
  );
}
