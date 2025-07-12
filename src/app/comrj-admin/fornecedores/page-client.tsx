"use client";

import { EmptyCard } from "@/components/empty-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBuilding,
  IconSearch,
  IconUsers,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useSuppliers } from "./_hooks/supplier-queries";

export function SuppliersPageClient() {
  const [search, setSearch] = useState("");
  const { data: suppliers = [], isLoading } = useSuppliers(search);

  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.isActive).length;
    const inactive = suppliers.filter((s) => !s.isActive).length;

    return { total, active, inactive };
  }, [suppliers]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Fornecedores
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              fornecedores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fornecedores Ativos
            </CardTitle>
            <IconUserCheck className="h-4 w-4 text-green-600" />
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
            <CardTitle className="text-sm font-medium">
              Fornecedores Inativos
            </CardTitle>
            <IconUserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.inactive / stats.total) * 100)}%`
                : "0%"}{" "}
              do total
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
              placeholder="Buscar por nome, CNPJ ou email..."
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
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <EmptyCard
              title="Nenhum fornecedor encontrado"
              description="Tente ajustar sua busca ou crie um novo fornecedor."
              icon={IconBuilding}
            >
              <></>
            </EmptyCard>
          ) : (
            <DataTable columns={columns} data={suppliers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
