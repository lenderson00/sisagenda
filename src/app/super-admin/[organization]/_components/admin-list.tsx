"use client";

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
import { cn } from "@/lib/utils";
import type { User as UserType } from "@prisma/client";
import { IconMail, IconUser } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Key, Lock, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminKeys } from "../_hooks/use-admins";

interface AdminListProps {
  admins: UserType[];
  organizationId: string;
}

export function AdminList({
  admins: initialAdmins,
  organizationId,
}: AdminListProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserType | null>(null);
  const queryClient = useQueryClient();

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `Senha redefinida com sucesso. Senha temporária: ${data.tempPassword}`,
      );
      setIsResetDialogOpen(false);
    },
    onError: () => {
      toast.error("Falha ao redefinir senha");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ admin }: { admin: UserType }) => {
      const endPoint = admin.isActive
        ? `/api/users/${admin.id}/deactivate`
        : `/api/users/${admin.id}/activate`;

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao alterar status");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(
        `${variables.admin.name} foi ${variables.admin.isActive ? "desativado" : "ativado"}`,
      );
      queryClient.invalidateQueries({
        queryKey: adminKeys.list(organizationId),
      });
    },
    onError: () => {
      toast.error("Falha ao alterar status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ admin }: { admin: UserType }) => {
      const response = await fetch(
        `/api/organizations/${admin.organizationId}/admin`,
        {
          method: "DELETE",
          body: JSON.stringify({
            userId: admin.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao excluir administrador");
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.admin.name} foi excluído`);
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: adminKeys.list(organizationId),
      });
    },
    onError: () => {
      toast.error("Falha ao excluir administrador");
    },
  });

  const handleResetPassword = async () => {
    if (!selectedAdmin) return;
    resetPasswordMutation.mutate(selectedAdmin.id);
  };

  const handleToggleStatus = async (admin: UserType) => {
    toggleStatusMutation.mutate({ admin });
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    deleteMutation.mutate({ admin: selectedAdmin });
  };

  if (initialAdmins.length === 0) {
    return (
      <div className="text-center py-12 w-full">
        <p className="text-muted-foreground">
          Nenhum administrador encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {initialAdmins.map((admin) => (
          <Card key={admin.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="space-y-1 flex h-fit  items-center gap-2">
                    <h3 className="font-semibold leading-none mt-1">
                      {admin.postoGraduacao} {admin.name}
                    </h3>

                    <Badge
                      variant={admin.isActive ? "outline" : "destructive"}
                      className={cn(
                        "text-xs p-0.5 px-2 ",
                        !admin.isActive &&
                          "text-white dark:text-destructive-foreground",
                      )}
                    >
                      {admin.isActive ? "Ativo" : "Inativo"}
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
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsResetDialogOpen(true);
                      }}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Redefinir Senha
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                      <Key className="mr-2 h-4 w-4" />
                      {admin.isActive ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    {!admin.isActive && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedAdmin(admin);
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
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IconMail className="h-4 w-4" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Added {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setIsResetDialogOpen(true);
                  }}
                >
                  <Lock className="mr-2 h-3 w-3" />
                  Redefinir Senha
                </Button>
                <Button
                  variant={admin.isActive ? "secondary" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleStatus(admin)}
                >
                  <Key className="mr-2 h-3 w-3" />
                  {admin.isActive ? "Desativar" : "Ativar"}
                </Button>
                {!admin.isActive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja redefinir a senha de{" "}
              <span className="font-bold">
                {selectedAdmin?.postoGraduacao} {selectedAdmin?.name}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Redefinir Senha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedAdmin?.name}? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white dark:text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
