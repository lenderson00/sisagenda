import { useChatList } from "../_hooks/use-chat-list";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

export const ChatList = ({ userId }: { userId: string }) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatList(userId);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url;
  };

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
              <div key={i} className="space-y-2">
                {page.items.map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    className={cn({
                      "text-neutral-500": !isActive("/chat/" + chat.id),
                      "text-primary": isActive("/chat/" + chat.id),
                    })}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={dayjs(chat.updatedAt).day().toLocaleString()}
                    >
                      <a href={"/chat/" + chat.id}>
                        <span>{chat.title || "Sem título"} </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
        ) : (
          <div>Sem mais conversas</div>
        )}
      </div>
    </div>
  );
};
