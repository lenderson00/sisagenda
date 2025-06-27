"use client";

import { EmptyCard } from "@/components/empty-card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconUser } from "@tabler/icons-react";
import { CreateOrganization } from "./_components/create-organization-dialog";
import { useOrganizations } from "./_hooks/use-organizations";
import { OrganizationsDataTable } from "./_table/data-table";
import { PageHeader } from "@/components/page-header";

export function OrganizationList() {
  const { data, isPending } = useOrganizations();

  return (
    <>
      <PageHeader
        title="Organizações"
        subtitle="Gerencie as organizações militares e seus administradores."
      >
        <CreateOrganization />
      </PageHeader>

      <div className="flex h-full flex-col gap-4 p-4">
        {isPending && (
          <div className="space-y-4">
            <div className="flex items-center py-4">
              <Skeleton className="h-10 w-full md:max-w-sm" />
              <Skeleton className="ml-auto h-10 w-24" />
            </div>
            <Skeleton className="h-[50vh] w-full" />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        )}

        {!isPending && data && data.length > 0 && (
          <OrganizationsDataTable data={data} />
        )}

        {!isPending && (!data || data.length === 0) && (
          <div className="flex-1 rounded-lg border border-dashed shadow-sm">
            <EmptyCard
              title="Nenhuma organização encontrada"
              description="Comece criando sua primeira Organização Militar."
              icon={IconUser}
            >
              <CreateOrganization />
            </EmptyCard>
          </div>
        )}
      </div>
    </>
  );
}
