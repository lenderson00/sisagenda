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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconTruck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CreateDeliveryTypeDialog } from "./_components/create-delivery-type-dialog";
import { useDeleteDeliveryType } from "./_hooks/delivery-type-mutations";
import { useDeliveryTypes } from "./_hooks/delivery-type-queries";

interface DeliveryType {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeliveryTypesPageClientProps {
  organizationId: string;
}

export function DeliveryTypesPageClient({
  organizationId,
}: DeliveryTypesPageClientProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<DeliveryType | null>(null);
  const queryClient = useQueryClient();

  const { data: deliveryTypes = [], isLoading } =
    useDeliveryTypes(organizationId);
  const deleteMutation = useDeleteDeliveryType(organizationId);

  const handleDelete = async () => {
    if (!selectedDeliveryType) return;
    deleteMutation.mutate(selectedDeliveryType.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">
            Carregando tipos de transporte...
          </p>
        </div>
      </div>
    );
  }

  if (deliveryTypes.length === 0) {
    return (
      <div className="">
        <div className="container mx-auto md:px-6 px-4 md:py-8 py-6">
          <EmptyCard
            icon={IconTruck}
            title="Nenhum tipo de transporte encontrado"
            description="Adicione um novo tipo de transporte para começar"
          >
            <CreateDeliveryTypeDialog orgId={organizationId} />
          </EmptyCard>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto md:px-6 px-4 md:py-8 py-6">
        {/* Delivery Types Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {deliveryTypes.map((deliveryType: DeliveryType) => (
            <Link
              key={deliveryType.id}
              href={`/transporte/${deliveryType.id}`}
              className="block"
            >
              <Card className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">
                        {deliveryType.name}
                      </h3>
                      <Badge
                        variant={
                          deliveryType.isActive ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {deliveryType.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedDeliveryType(deliveryType);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                {deliveryType.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {deliveryType.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* Delete Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Tipo de Transporte</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir {selectedDeliveryType?.name}?
                Esta ação não pode ser desfeita.
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
    </div>
  );
}
