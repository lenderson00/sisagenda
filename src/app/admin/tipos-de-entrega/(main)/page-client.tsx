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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useOrganization } from "@/hooks/use-organization";
import {
  Clock,
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useDeleteDeliveryType,
  useUpdateDeliveryType,
} from "./_hooks/delivery-type-mutations";
import { useDeliveryTypes } from "./_hooks/delivery-type-queries";
import type { DeliveryType } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconPackage } from "@tabler/icons-react";

export function DeliveryTypesPageClient({
  organizationId,
}: { organizationId: string }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<DeliveryType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: organization } = useOrganization(organizationId);
  const { data: deliveryTypes = [], isLoading } =
    useDeliveryTypes(organizationId);

  const deleteMutation = useDeleteDeliveryType(organizationId);
  const updateMutation = useUpdateDeliveryType(organizationId);

  const filteredDeliveryTypes = deliveryTypes.filter(
    (deliveryType: DeliveryType) =>
      deliveryType.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!selectedDeliveryType) return;
    deleteMutation.mutate(selectedDeliveryType.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedDeliveryType(null);
      },
    });
  };

  const handleToggleVisible = (deliveryType: DeliveryType) => {
    updateMutation.mutate({
      id: deliveryType.id,
      data: { isVisible: !deliveryType.isVisible },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="divide-y divide-muted border border-muted rounded-lg overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Procurar"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {deliveryTypes.length === 0 && !isLoading ? (
        <EmptyCard
          title="Nenhum tipo de entrega"
          description="Você ainda não criou nenhum tipo de entrega."
          icon={IconPackage}
        >
          <Button asChild>
            <Link href="/tipos-de-entrega/novo">Criar tipo de entrega</Link>
          </Button>
        </EmptyCard>
      ) : filteredDeliveryTypes.length === 0 ? (
        <p className="p-4 text-center text-muted-foreground">
          Nenhum resultado encontrado para &quot;{searchQuery}&quot;.
        </p>
      ) : (
        <div className="divide-y divide-border border rounded-lg overflow-hidden">
          {filteredDeliveryTypes.map(
            (deliveryType: DeliveryType, index: number) => {
              return (
                <div
                  key={deliveryType.id}
                  className="flex items-center justify-between p-4 hover:bg-accent duration-300 transition-all"
                >
                  <Link href={`/tipos-de-entrega/${deliveryType.id}`}>
                    <div className="flex items-center gap-4">
                      <div className="space-y-2 ">
                        <p className="font-medium">
                          {deliveryType.name}
                          <span className="text-sm text-muted-foreground ml-2">
                            /{organization?.sigla.toLowerCase()}/
                            {deliveryType.slug}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {deliveryType.duration && (
                            <Badge variant="secondary" className="gap-1.5">
                              <Clock className="h-3 w-3" />
                              {deliveryType.duration}m
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 justify-center">
                    {!deliveryType.isVisible && (
                      <Badge variant="secondary" className="gap-1.5">
                        Escondido
                      </Badge>
                    )}
                    <Tooltip>
                      <TooltipTrigger
                        className="flex items-center justify-center"
                        asChild
                      >
                        <div>
                          <Switch
                            checked={deliveryType.isVisible}
                            onCheckedChange={() =>
                              handleToggleVisible(deliveryType)
                            }
                            className="scale-115 mx-2 cursor-pointer"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {deliveryType.isVisible
                          ? "Ocultar no agendamento"
                          : "Exibir no agendamento"}
                      </TooltipContent>
                    </Tooltip>
                    <div className="rounded-sm border overflow-hidden divide-x">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/agendar/${organization?.sigla.toLowerCase()}/${
                              deliveryType.slug
                            }`}
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={10}>
                          Pré-visualizar
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={0}>
                          Copiar link do tipo de entrega
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-none "
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/tipos-de-entrega/${deliveryType.id}`}>
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
                </div>
              );
            },
          )}
        </div>
      )}

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
