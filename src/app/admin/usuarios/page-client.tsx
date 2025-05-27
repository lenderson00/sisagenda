"use client";

import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Plus, UserCheck, UserMinus, UserX, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UserForm } from "./_components/user-form";
import { useCreateUser } from "./_hooks/user-queries";

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

interface Stats {
  total: number;
  active: number;
  inactive: number;
  suspended?: number;
}

interface UsersPageClientProps {
  users: User[];
  stats: Stats;
}

type UserData = {
  name: string;
  email: string;
  whatsapp: string;
};

export function UsersPageClient({ users, stats }: UsersPageClientProps) {
  const getStatusColor = (status: User["isActive"]) => {
    switch (status) {
      case true:
        return "bg-emerald-100 text-emerald-800";
      case false:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "FORNECEDOR":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-[80vh] ">
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-gray-200 shadow-sm">
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

          <Card className="border-gray-200 shadow-sm">
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

          <Card className="border-gray-200 shadow-sm">
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

          <Card className="border-gray-200 shadow-sm">
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

        {/* Users List */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No users found
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user: any) => (
                  <Link
                    key={user.id}
                    href={`/usuarios/${user.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name
                              .split(" ")
                              .map((n: string[]) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.department && (
                            <p className="text-xs text-gray-400">
                              {user.department}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {user.lastLogin
                              ? format(user.lastLogin, "MMM dd")
                              : "Never"}
                          </p>
                          <p className="text-xs text-gray-400">Last login</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
