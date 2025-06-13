import { useChatList, useDeleteChat, useRenameChat } from "../_hooks/use-chat";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChatItem } from "./chat-item";

export const ChatList = () => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatList();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending")
    return (
      <div className="space-y-2 mx-4 mt-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  if (status === "error") return <div>Error loading chats</div>;

  return (
    <div className="mx-4">
      <SidebarGroup className="first:p-0">
        <SidebarGroupLabel className="p-0">Conversas</SidebarGroupLabel>
        {data.pages.length > 0 && (
          <SidebarMenu>
            {data.pages.map((page, i) => (
              <div key={i}>
                {page.items.map((chat, index) => (
                  <ChatItem
                    key={chat.id + "-" + index}
                    id={chat.id}
                    title={chat.title ?? "Nova conversa"}
                  />
                ))}
              </div>
            ))}
          </SidebarMenu>
        )}
      </SidebarGroup>

      <div ref={ref} className="h-10 text-neutral-400">
        {isFetchingNextPage ? (
          <div>Carregando...</div>
        ) : hasNextPage ? (
          <div>Carregar mais...</div>
        ) : null}
      </div>
    </div>
  );
};
