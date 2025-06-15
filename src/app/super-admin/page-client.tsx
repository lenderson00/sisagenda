"use client";

import { EmptyCard } from "@/components/empty-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconUser } from "@tabler/icons-react";
import { Building, Edit, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { CreateOrganization } from "./_components/create-organization-dialog";
import { useOrganizations } from "./_hooks/use-organizations";
import { columns } from "./_table/columns";
import { DataTable } from "./_table/data-table";

export function OrganizationList() {
  const { data, isPending } = useOrganizations();

  if (!data) return;

  if (isPending) {
    return <> Loading... </>;
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8 flex-1 h-full flex flex-col">
        {data.length > 0 ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <EmptyCard
            title="Nenhuma organização encontrada"
            description="Comece criando sua primeira Organização Militar."
            icon={IconUser}
          >
            <CreateOrganization />
          </EmptyCard>
        )}
      </div>
    </>
  );
}
