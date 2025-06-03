"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Organization } from "@prisma/client";
import { IconUser } from "@tabler/icons-react";
import { AdminList } from "./_components/admin-list";
import { CreateAdminDialog } from "./_components/create-admin-dialog";
import { useAdmins } from "./_hooks/use-admins";

interface OrganizationAdminClientProps {
  organization: Organization;
}

export function OrganizationAdminClient({
  organization,
}: OrganizationAdminClientProps) {
  const { data: admins, isLoading } = useAdmins(organization.id);

  return (
    <div className="h-full">
      <div className="border-b bg-gray-50 py-8 px-8">
        <div className="container mx-auto flex items-center justify-between mt-4">
          <div>
            <div className="flex gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {organization.name}
              </h1>
            </div>
            <p className="text-gray-600 mt-1">{organization.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : admins && admins.length > 0 ? (
          <div className="w-full">
            <AdminList admins={admins} organizationId={organization.id} />
          </div>
        ) : (
          <Card className="text-center py-12 border-gray-200">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <IconUser className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Nenhum administrador
                  </h3>
                  <p className="text-gray-600">
                    Adicione um administrador para gerenciar esta organização.
                  </p>
                </div>
                <CreateAdminDialog organizationId={organization.id} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
