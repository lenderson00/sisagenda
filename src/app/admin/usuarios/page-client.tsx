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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@prisma/client";
import { UserCheck, UserMinus, UserX, Users } from "lucide-react";
import { useState } from "react";
import { UsersDataTable } from "./_components/data-table";
import { StatCard } from "./_components/stat-card";
import { UsersPageSkeleton } from "./_components/users-page-skeleton";
import {
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
  usePasswordReset,
} from "./_hooks/user-mutations";
import { useUserStats, useUsers } from "./_hooks/user-queries";

interface UsersPageClientProps {
  organizationId: string;
}

export function UsersPageClient({ organizationId }: UsersPageClientProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading: isLoadingUsers } =
    useUsers(organizationId);

  const {
    data: stats = { total: 0, active: 0, inactive: 0, suspended: 0 },
    isLoading: isLoadingStats,
  } = useUserStats(organizationId);

  const resetPasswordMutation = usePasswordReset();
  const deleteMutation = useDeleteUser(organizationId);
  const activateMutation = useActivateUser(organizationId);
  const deactivateMutation = useDeactivateUser(organizationId);

  const handleActivate = (userId: string) => {
    activateMutation.mutate(userId);
  };

  const handleDeactivate = (userId: string) => {
    deactivateMutation.mutate(userId);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPasswordClick = (user: User) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    resetPasswordMutation.mutate(selectedUser.id);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  if (isLoadingUsers || isLoadingStats) {
    return <UsersPageSkeleton />;
  }

  return (
    <div className="min-h-[80vh]">
      <div className=" px-4 pt-2">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatCard
            title="Total de Usuários"
            value={stats?.total || 0}
            icon={Users}
          />
          <StatCard
            title="Usuários Ativos"
            value={stats?.active || 0}
            icon={UserCheck}
          />
          <StatCard
            title="Usuários Inativos"
            value={stats?.inactive || 0}
            icon={UserMinus}
          />
          <StatCard
            title="Usuários Suspensos"
            value={stats?.suspended || 0}
            icon={UserX}
          />
        </div>

        {/* Data Table with Filters */}
        <UsersDataTable
          data={users}
          handleActivate={handleActivate}
          handleDeactivate={handleDeactivate}
          handleDelete={handleDeleteClick}
          handleResetPassword={handleResetPasswordClick}
        />

        {/* Reset Password Dialog */}
        <AlertDialog
          open={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset the password for{" "}
                {selectedUser?.name}? A password reset link will be sent to
                their email address.
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

        {/* Delete User Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedUser?.name}? This
                action cannot be undone.
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
      </div>
    </div>
  );
}
