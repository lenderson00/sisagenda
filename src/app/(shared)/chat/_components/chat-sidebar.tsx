"use client";

import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { IconDashboard, IconWriting } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCreateChat } from "../_hooks/use-create-chat";
import { ChatList } from "./chat-list";

export const ChatSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();

  return (
    <Sidebar variant="inset" {...props} className="top-16">
      <Button
        className="mx-2 justify-start shadow-none mb-4"
        variant={"outline"}
        onClick={() => router.push("/chat")}
      >
        <IconWriting />
        Nova Conversa
      </Button>
      <SidebarContent>
        <ChatList />
      </SidebarContent>
    </Sidebar>
  );
};
