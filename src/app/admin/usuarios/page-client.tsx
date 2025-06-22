"use client";

import { BreadcrumbNav } from "@/components/breadcrumb-nav";
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
import {
  IconCalendar,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  Key,
  MoreHorizontal,
  Plus,
  Trash,
  UserCheck,
  UserMinus,
  UserX,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { UserForm } from "./_components/user-form";
import {
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
  usePasswordReset,
} from "./_hooks/user-mutations";
import { useUserStats, useUsers } from "./_hooks/user-queries";

// Types for props
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  whatsapp?: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: {
    id: string;
    name: string;
    sigla: string;
  };
  department?: string;
  lastLogin?: string | null;
  status?: string;
}

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

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    resetPasswordMutation.mutate(selectedUser.id);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  const handleActivate = async (userId: string) => {
    activateMutation.mutate(userId);
  };

  const handleDeactivate = async (userId: string) => {
    deactivateMutation.mutate(userId);
  };

  if (isLoadingUsers || isLoadingStats) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      <div className="container mx-auto pt-2">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
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
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-500" />
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
                Inactive Users
              </CardTitle>
              <UserMinus className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats?.inactive || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Suspended Users
              </CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.suspended || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {users.map((user: User) => (
            <Card key={user.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <IconUser className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none">
                        {user.name}
                      </h3>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.isActive ? "Active" : "Inactive"}
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
                          setSelectedUser(user);
                          setIsResetDialogOpen(true);
                        }}
                      >
                        <IconLock className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      {user.isActive ? (
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(user.id)}
                          className="text-yellow-600 focus:text-yellow-600"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleActivate(user.id)}
                          className="text-emerald-600 focus:text-emerald-600"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      {!user.isActive && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedUser(user);
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
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>
                      Added{" "}
                      {format(new Date(user.createdAt || ""), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsResetDialogOpen(true);
                    }}
                  >
                    <IconLock className="mr-2 h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
