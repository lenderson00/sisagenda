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
import { DrawerDialog } from "@/components/ui/dialog-drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { Building, Edit, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { CreateOrganization } from "./_components/create-organization-dialog";
import { OrganizationForm } from "./_components/organization-form";
import { useOrganizations } from "./_hooks/use-organizations";

export function OrganizationList() {
  const { data, isPending } = useOrganizations();

  if (!data) return;

  if (isPending) {
    return <> Loading... </>;
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8 flex-1 h-full flex flex-col">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((organization) => (
            <Card key={organization.id} className="border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg text-gray-900">
                        {organization.name}
                      </CardTitle>
                      <Badge
                        variant={
                          organization.role === "COMIMSUP"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          organization.role === "COMIMSUP"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {organization.role}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {organization.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-gray-200"
                    >
                      <Link href={`/${organization.id}/editar`}>
                        <DropdownMenuItem className="text-gray-700 hover:bg-gray-50">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {organization.sigla}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{organization.role}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Criado em{" "}
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      variant="outline"
                    >
                      <Link href={`/${organization.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.length === 0 && (
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
