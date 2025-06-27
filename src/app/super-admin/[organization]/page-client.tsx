"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DrawerDialog } from "@/components/ui/dialog-drawer";
import type { Organization } from "@prisma/client";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { AdminForm } from "./_components/admin-form";
import { AdminList } from "./_components/admin-list";
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
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : admins && admins.length > 0 ? (
          <div className="w-full">
            <AdminList admins={admins} organizationId={organization.id} />
          </div>
        ) : (
          <Card className="text-center py-12 border-muted">
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
                <DrawerDialog
                  action="Adicionar Administrador"
                  icon={IconPlus}
                  title="Adicionar Administrador"
                  description="Adicione um administrador para gerenciar esta organização."
                >
                  <AdminForm organizationId={organization.id} />
                </DrawerDialog>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
