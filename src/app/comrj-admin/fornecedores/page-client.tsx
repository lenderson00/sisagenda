"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { EmptyCard } from "@/components/empty-card";
import { IconBuilding } from "@tabler/icons-react";
import { Building, UserCheck, UserX, Users, Calendar } from "lucide-react";
import { useMemo } from "react";
import { SuppliersDataTable } from "./_components/suppliers-data-table";
import { SuppliersPageSkeleton } from "./_components/suppliers-page-skeleton";
import { useSuppliers } from "./_hooks/supplier-queries";

export function SuppliersPageClient() {
  const { data: suppliers = [], isLoading } = useSuppliers();

  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.isActive).length;
    const inactive = suppliers.filter((s) => !s.isActive).length;

    // Recent suppliers (created in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = suppliers.filter(
      (s) => new Date(s.createdAt) > thirtyDaysAgo,
    ).length;

    return { total, active, inactive, recent };
  }, [suppliers]);

  if (isLoading) {
    return <SuppliersPageSkeleton />;
  }

  // Always show the main layout with stats, even when there are no suppliers

  return (
    <div className="min-h-[80vh]">
      <div className="px-4 pt-2">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total de Fornecedores"
            value={stats.total}
            icon={Users}
            description="fornecedores cadastrados"
          />
          <StatsCard
            title="Fornecedores Ativos"
            value={stats.active}
            icon={UserCheck}
            description={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% do total`}
          />
          <StatsCard
            title="Fornecedores Inativos"
            value={stats.inactive}
            icon={UserX}
            description={`${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% do total`}
          />
          <StatsCard
            title="Novos Fornecedores"
            value={stats.recent}
            icon={Calendar}
            description="últimos 30 dias"
          />
        </div>

        <SuppliersDataTable data={suppliers} />
      </div>
    </div>
  );
}
