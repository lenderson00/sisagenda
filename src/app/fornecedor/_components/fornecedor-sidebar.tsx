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
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconBuilding,
  IconCalendar,
  IconCalendarOff,
  IconDashboard,
  IconSettings,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";

const main = [
  {
    name: "Dashboard",
    url: "/",

    icon: IconDashboard,
  },

  {
    name: "Agenda",
    url: "/agenda",
    icon: IconCalendar,
  },

  {
    name: "Configurações",
    url: "/configuracoes",
    icon: IconSettings,
  },
];

export const FornecedorSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-12 -ml-2 items-center justify-center rounded-lg">
                  <Logo className="size-10" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SisAgenda</span>
                  <span className="truncate text-xs">Administração</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={main} className="my-0" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
