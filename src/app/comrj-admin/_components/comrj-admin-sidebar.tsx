"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { mainMenuItems } from "../_config/nav-bar";

export const ComrjAdminSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="relative flex-row justify-between items-center">
        <SidebarMenu className="w-fit">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="w-full">
              <a href="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-12 -ml-2 items-center justify-center rounded-lg">
                  <Logo className="size-10" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SisAgenda</span>
                  <span className="truncate text-xs">COMRJ</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainMenuItems} className="my-0" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
