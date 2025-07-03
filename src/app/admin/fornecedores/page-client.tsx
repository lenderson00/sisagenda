"use client";

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
import { IconBuilding } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Building, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { SearchSupplierDialog } from "./_components/search-supplier-dialog";
import { SuppliersDataTable } from "./_components/data-table";
import { StatCard } from "./_components/stat-card";
import { SuppliersPageSkeleton } from "./_components/suppliers-page-skeleton";
import {
  useActivateSupplier,
  useDeactivateSupplier,
  useDeleteSupplier,
} from "./_hooks/supplier-mutations";
import { useSupplierStats, useSuppliers } from "./_hooks/supplier-queries";

// Types for props
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj?: string;
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

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  if (isLoadingSuppliers || isLoadingStats) {
    return <SuppliersPageSkeleton />;
  }

  return (
    <div className="min-h-[80vh]">
      <div className="px-4 pt-2">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Total de Fornecedores"
            value={stats?.total || 0}
            icon={Building}
          />
          <StatCard
            title="Fornecedores Ativos"
            value={stats?.active || 0}
            icon={CheckCircle}
          />
          <StatCard
            title="Fornecedores Inativos"
            value={stats?.inactive || 0}
            icon={XCircle}
          />
        </div>
        {suppliers.length === 0 ? (
          <EmptyCard
            title="Nenhum fornecedor encontrado"
            description="Comece procurando por um fornecedor existente ou criando um novo."
            icon={IconBuilding}
          >
            <SearchSupplierDialog orgId={organizationId} />
          </EmptyCard>
        ) : (
          <SuppliersDataTable
            data={suppliers}
            handleActivate={handleActivate}
            handleDeactivate={handleDeactivate}
            handleDelete={handleDeleteClick}
          />
        )}
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
