"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useDeleteChat, useRenameChat } from "../_hooks/use-chat";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { IconDots } from "@tabler/icons-react";

/**
 * Single chat item for the sidebar. Handles navigation, rename and delete
 * operations with optimistic feedback via Sonner toasts.
 */
export type ChatItemProps = {
  id: string;
  title: string;
};

export const ChatItem: React.FC<ChatItemProps> = ({ id, title }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Local state for rename dialog
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // Keep local title in sync when parent prop changes (e.g. via live updates)
  useEffect(() => setNewTitle(title), [title]);

  /**
   * Helpers & derived data
   * -------------------------------------------------------------------- */
  const chatUrl = useMemo(() => `/chat/${id}`, [id]);
  const isActive = pathname === chatUrl;

  /**
   * Mutations
   * -------------------------------------------------------------------- */
  const { mutateAsync: deleteChat, isPending: isDeleting } = useDeleteChat();
  const { mutateAsync: renameChat, isPending: isRenaming } = useRenameChat();

  /**
   * Handlers
   * -------------------------------------------------------------------- */
  const handleDelete = useCallback(async () => {
    try {
      await toast.promise(
        deleteChat(id, {
          onSuccess: ({ success, error }) => {
            if (!success) throw new Error(error);
          },
        }),
        {
          loading: "Deletando conversa...",
          success: "Conversa deletada com sucesso.",
          error: "Erro ao deletar conversa.",
        },
      );

      if (isActive) router.push("/chat");
    } catch {
      /* Error already handled by toast */
    } finally {
      setMenuOpen(false);
      setDeleteOpen(false);
    }
  }, [deleteChat, id, isActive, router]);

  const handleRename = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Avoid unnecessary requests
      if (!newTitle.trim() || newTitle.trim() === title) {
        setRenameOpen(false);
        setMenuOpen(false);
        return;
      }

      try {
        await toast.promise(
          renameChat(
            { chatId: id, title: newTitle.trim() },
            {
              onSuccess: ({ success, error }) => {
                if (!success) throw new Error(error);
              },
            },
          ),
          {
            loading: "Renomeando...",
            success: "Conversa renomeada.",
            error: "Erro ao renomear conversa.",
          },
        );
      } catch {
        /* Error already handled by toast */
      } finally {
        setRenameOpen(false);
        setMenuOpen(false);
      }
    },
    [renameChat, id, newTitle, title],
  );

  /**
   * Render
   * -------------------------------------------------------------------- */
  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <SidebarMenuItem
          className={cn(
            "group/chat -mx-4 flex items-center justify-between px-2",
            !isActive && "text-neutral-500",
            isActive && "text-primary",
          )}
        >
          {/* Chat link ------------------------------------------------------ */}
          <SidebarMenuButton
            asChild
            className={cn(
              "w-full justify-start",
              isActive && "bg-sidebar-accent",
            )}
          >
            <Link href={chatUrl} className="flex-1 truncate pr-2">
              {title}
            </Link>
          </SidebarMenuButton>

          {/* Context menu --------------------------------------------------- */}

          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover/chat:opacity-100"
            >
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="z-[9999] w-56">
            <DropdownMenuGroup>
              {/* Rename --------------------------------------------------- */}
              <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                Renomear
              </DropdownMenuItem>

              {/* Delete --------------------------------------------------- */}
              <DropdownMenuItem
                className="text-red-500"
                onSelect={() => setDeleteOpen(true)}
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </SidebarMenuItem>
      </DropdownMenu>

      {/* Rename --------------------------------------------------- */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle>Renomear conversa</DialogTitle>
              <DialogDescription>
                Defina um novo título para a conversa.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chat-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="chat-name"
                  autoFocus
                  disabled={isRenaming}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isRenaming}>
                {isRenaming ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete --------------------------------------------------- */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível e removerá a conversa permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
