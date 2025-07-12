"use client";

import { EmptyCard } from "@/components/empty-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBuildingCommunity,
  IconSearch,
  IconBuilding,
  IconBuildingStore,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { OrganizationsDataTable } from "./_components/data-table";
import { useOrganizations } from "./_hooks/organization-queries";

export function OrganizationsPageClient() {
  const [search, setSearch] = useState("");
  const { data: organizations = [], isLoading } = useOrganizations();

  const filteredOrganizations = useMemo(() => {
    if (!search) return organizations;

    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.sigla.toLowerCase().includes(search.toLowerCase()) ||
        org.role.toLowerCase().includes(search.toLowerCase()),
    );
  }, [organizations, search]);

  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter((org) => org.isActive).length;
    const inactive = organizations.filter((org) => !org.isActive).length;

    const byRole = organizations.reduce(
      (acc, org) => {
        acc[org.role] = (acc[org.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, active, inactive, byRole };
  }, [organizations]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>

        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full max-w-sm" />

        {/* Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Organizações
            </CardTitle>
            <IconBuildingCommunity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              organizações cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Organizações Ativas
            </CardTitle>
            <IconBuilding className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.active / stats.total) * 100)}%`
                : "0%"}{" "}
              do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depósitos</CardTitle>
            <IconBuildingWarehouse className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byRole.DEPOSITO || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              organizações tipo depósito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COMRJ</CardTitle>
            <IconBuildingStore className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.byRole.COMRJ || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              organizações tipo COMRJ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, sigla ou tipo..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Organizações</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrganizations.length === 0 ? (
            <EmptyCard
              title="Nenhuma organização encontrada"
              description={
                search
                  ? "Tente ajustar sua busca."
                  : "Nenhuma organização encontrada para este COMRJ."
              }
              icon={IconBuildingCommunity}
            >
              <></>
            </EmptyCard>
          ) : (
            <OrganizationsDataTable data={filteredOrganizations} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
