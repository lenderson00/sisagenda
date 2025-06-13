"use client";

import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { IconDashboard, IconWriting } from "@tabler/icons-react";
import { ChatList } from "./chat-list";

const main = [
  {
    name: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
];

export const ChatSidebar = ({
  userId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userId: string }) => {
  return (
    <Sidebar variant="inset" {...props} className="top-16">
      <Button
        className="mx-2 justify-start shadow-none mb-4"
        variant={"outline"}
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
