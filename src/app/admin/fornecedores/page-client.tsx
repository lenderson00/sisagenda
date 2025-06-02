"use client";

import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { EmptyCard } from "@/components/empty-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconBuilding, IconMail, IconPhone } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building,
  CheckCircle,
  Key,
  MoreHorizontal,
  Plus,
  Trash,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CreateSupplierDialog } from "./_components/create-supplier-dialog";
import { SupplierForm } from "./_components/supplier-form";
import {
  useActivateSupplier,
  useDeactivateSupplier,
  useDeleteSupplier,
} from "./_hooks/supplier-mutations";
import { useSupplierStats, useSuppliers } from "./_hooks/supplier-queries";

// Types for props
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: {
    id: string;
    name: string;
    sigla: string;
  };
  status?: string;
}

interface SuppliersPageClientProps {
  organizationId: string;
}

export function SuppliersPageClient({
  organizationId,
}: SuppliersPageClientProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading: isLoadingSuppliers } =
    useSuppliers(organizationId);

  const {
    data: stats = { total: 0, active: 0, inactive: 0 },
    isLoading: isLoadingStats,
  } = useSupplierStats(organizationId);

  const deleteMutation = useDeleteSupplier(organizationId);
  const activateMutation = useActivateSupplier(organizationId);
  const deactivateMutation = useDeactivateSupplier(organizationId);

  const handleDelete = async () => {
    if (!selectedSupplier) return;
    deleteMutation.mutate(selectedSupplier.id);
  };

  const handleActivate = async (supplierId: string) => {
    activateMutation.mutate(supplierId);
  };

  const handleDeactivate = async (supplierId: string) => {
    deactivateMutation.mutate(supplierId);
  };

  if (isLoadingSuppliers || isLoadingStats) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando fornecedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total de Fornecedores
              </CardTitle>
              <Building className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Fornecedores Ativos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats?.active || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Fornecedores Inativos
              </CardTitle>
              <XCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats?.inactive || 0}
              </div>
            </CardContent>
          </Card>
        </div>
        {suppliers.length === 0 && (
          <EmptyCard
            title="Nenhum fornecedor encontrado"
            description="Comece criando seu primeiro fornecedor."
            icon={IconBuilding}
          >
            <CreateSupplierDialog orgId={organizationId} />
          </EmptyCard>
        )}
        {/* Suppliers Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {suppliers.map((supplier: Supplier) => (
            <Card
              key={supplier.id}
              className="relative hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <IconBuilding className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none">
                        {supplier.name}
                      </h3>
                      <Badge
                        variant={supplier.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {supplier.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {supplier.isActive ? (
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(supplier.id)}
                          className="text-yellow-600 focus:text-yellow-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleActivate(supplier.id)}
                          className="text-emerald-600 focus:text-emerald-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                      {!supplier.isActive && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <IconMail className="mr-2 h-4 w-4" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <IconPhone className="mr-2 h-4 w-4" />
                    {supplier.phone}
                  </div>
                  {supplier.address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <IconBuilding className="mr-2 h-4 w-4" />
                      {supplier.address}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fornecedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
