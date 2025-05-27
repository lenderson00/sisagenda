"use client";

import { ArrowLeft, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import Link from "next/link";
import type { Organization, User as UserType } from "@prisma/client";
import { CreateAdminDialog } from "./_components/create-admin-dialog";

interface OrganizationAdminClientProps {
  organization: Organization & {
    militares: UserType[];
  };
}

export function OrganizationAdminClient({
  organization,
}: OrganizationAdminClientProps) {
  const breadcrumbItems = [
    { label: "Organizações", href: "/" },
    { label: organization.name, href: `/${organization.id}` },
  ];

  return (
    <div className="min-h-screen bg-white">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organization.militares.map((admin) => (
            <Card key={admin.id} className="border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg text-gray-900">
                        {admin.name}
                      </CardTitle>
                      <Badge
                        variant="default"
                        className="bg-gray-900 text-white"
                      >
                        Administrador
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {admin.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Criado em {admin.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {organization.militares.length === 0 && (
          <Card className="text-center py-12 border-gray-200">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
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
