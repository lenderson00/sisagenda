"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { EmptyCard } from "@/components/empty-card";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { Building, Calendar, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { DepositsDataTable } from "./_components/deposits-data-table";
import { DepositsPageSkeleton } from "./_components/deposits-page-skeleton";
import { useOrganizations } from "./_hooks/organization-queries";

export function OrganizationsPageClient() {
  const { data: deposits = [], isLoading } = useOrganizations();

  const stats = useMemo(() => {
    const total = deposits.length;
    const active = deposits.filter((dep) => dep.isActive).length;
    const totalAppointments = deposits.reduce(
      (sum, dep) => sum + dep.totalAppointments,
      0,
    );
    const pendingAppointments = deposits.reduce(
      (sum, dep) => sum + dep.pendingAppointments,
      0,
    );

    return { total, active, totalAppointments, pendingAppointments };
  }, [deposits]);

  if (isLoading) {
    return <DepositsPageSkeleton />;
  }

  if (deposits.length === 0) {
    return (
      <div className="min-h-[80vh]">
        <div className="px-4 pt-2">
          <EmptyCard
            title="Nenhum depósito encontrado"
            description="Nenhum depósito foi encontrado no sistema."
            icon={IconBuildingWarehouse}
          >
            <div />
          </EmptyCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="px-4 pt-2">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatsCard
            title="Total de Depósitos"
            value={stats.total}
            icon={Building}
            description="depósitos cadastrados"
          />
          <StatsCard
            title="Depósitos Ativos"
            value={stats.active}
            icon={TrendingUp}
            description={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% do total`}
          />
          <StatsCard
            title="Total de Agendamentos"
            value={stats.totalAppointments}
            icon={Calendar}
            description="agendamentos realizados"
          />
          <StatsCard
            title="Agendamentos Pendentes"
            value={stats.pendingAppointments}
            icon={Clock}
            description="pendentes de confirmação"
          />
        </div>

        {/* Data Table with Filters */}
        <DepositsDataTable data={deposits} />
      </div>
    </div>
  );
}
