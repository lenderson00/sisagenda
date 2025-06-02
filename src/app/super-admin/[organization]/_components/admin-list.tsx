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
      const response = await fetch(`/api/users/${admin.id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle status");
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
        throw new Error("Failed to delete admin");
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
        <p className="text-muted-foreground">No administrators found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {initialAdmins.map((admin) => (
          <Card
            key={admin.id}
            className="relative hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <IconUser className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-none">{admin.name}</h3>
                    <Badge
                      variant={admin.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {admin.isActive ? "Active" : "Inactive"}
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
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                      <Key className="mr-2 h-4 w-4" />
                      {admin.isActive ? "Deactivate" : "Activate"}
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
                        Delete
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
                  Reset
                </Button>
                <Button
                  variant={admin.isActive ? "secondary" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleStatus(admin)}
                >
                  <Key className="mr-2 h-3 w-3" />
                  {admin.isActive ? "Deactivate" : "Activate"}
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
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for{" "}
              {selectedAdmin?.name}? A password reset link will be sent to their
              email address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Reset Password
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
            <AlertDialogTitle>Delete Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedAdmin?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
