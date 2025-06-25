"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, UserCheck, UserMinus } from "lucide-react";
import type { User } from "@prisma/client";
import { IconLock } from "@tabler/icons-react";

interface UserActionsProps {
  user: User;
  onResetPassword: (user: User) => void;
  onDeactivate: (userId: string) => void;
  onActivate: (userId: string) => void;
  onDelete: (user: User) => void;
}

export function UserActions({
  user,
  onResetPassword,
  onDeactivate,
  onActivate,
  onDelete,
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onResetPassword(user)}>
          <IconLock className="mr-2 h-4 w-4" />
          Resetar Senha
        </DropdownMenuItem>
        {user.isActive ? (
          <DropdownMenuItem
            onClick={() => onDeactivate(user.id)}
            className="text-yellow-600 focus:text-yellow-600"
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Desativar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onActivate(user.id)}
            className="text-emerald-600 focus:text-emerald-600"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Ativar
          </DropdownMenuItem>
        )}
        {!user.isActive && (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(user)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
