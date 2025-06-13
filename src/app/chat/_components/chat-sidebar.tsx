"use client";

import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { IconDashboard, IconWriting } from "@tabler/icons-react";
import { ChatList } from "./chat-list";
import { useCreateChat } from "../_hooks/use-create-chat";

export const ChatSidebar = ({
  userId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userId: string }) => {
  const { mutate: createChat, status } = useCreateChat(userId);
  return (
    <Sidebar variant="inset" {...props} className="top-16">
      <Button
        className="mx-2 justify-start shadow-none mb-4"
        variant={"outline"}
        onClick={() => createChat()}
        disabled={status === "pending"}
      >
        <IconWriting />
        Nova Conversa
      </Button>
      <SidebarContent>
        <ChatList userId={userId} />
      </SidebarContent>
    </Sidebar>
  );
};
