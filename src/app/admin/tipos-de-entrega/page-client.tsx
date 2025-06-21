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
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useOrganization } from "@/hooks/use-organization";
import { IconTruck } from "@tabler/icons-react";
import {
  Clock,
  Copy,
  Link2,
  MoreHorizontal,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateDeliveryTypeDialog } from "./_components/create-delivery-type-dialog";
import {
  useDeleteDeliveryType,
  useUpdateDeliveryType,
} from "./_hooks/delivery-type-mutations";
import { useDeliveryTypes } from "./_hooks/delivery-type-queries";

interface DeliveryType {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isActive: boolean;
  AvailabilitySettings: {
    duration: number;
  } | null;
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

  const { data: organization } = useOrganization(organizationId);
  const { data: deliveryTypes = [], isLoading } =
    useDeliveryTypes(organizationId);
  const deleteMutation = useDeleteDeliveryType(organizationId);
  const updateMutation = useUpdateDeliveryType(organizationId);

  const handleDelete = async () => {
    if (!selectedDeliveryType) return;
    deleteMutation.mutate(selectedDeliveryType.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedDeliveryType(null);
      },
    });
  };

  const handleToggleActive = (deliveryType: DeliveryType) => {
    updateMutation.mutate({
      id: deliveryType.id,
      data: { isActive: !deliveryType.isActive },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">
            Carregando tipos de transporte...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Input placeholder="Procurar" className="pl-8" />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
        {deliveryTypes.map((deliveryType: DeliveryType, index: number) => {
          return (
            <div
              key={deliveryType.id}
              className="flex items-center justify-between p-4 hover:bg-neutral-50"
            >
              <Link href={`/admin/tipos-de-entrega/${deliveryType.id}`}>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 ">
                    <p className="font-medium">
                      {deliveryType.name}
                      <span className="text-sm text-muted-foreground ml-2">
                        /{organization?.sigla.toLowerCase()}/{deliveryType.slug}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {deliveryType.AvailabilitySettings?.duration && (
                        <Badge variant="secondary" className="gap-1.5">
                          <Clock className="h-3 w-3" />
                          {deliveryType.AvailabilitySettings.duration}m
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Switch
                  checked={deliveryType.isActive}
                  onCheckedChange={() => handleToggleActive(deliveryType)}
                />
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={`/agendar/${organization?.sigla.toLowerCase()}/${
                      deliveryType.slug
                    }`}
                  >
                    <Link2 className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/tipos-de-entrega/${deliveryType.id}`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
            </div>
          );
        })}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tipo de Transporte</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedDeliveryType?.name}? Esta
              ação não pode ser desfeita.
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
