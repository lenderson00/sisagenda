"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import AppSidebarOpenTrigger from "@/components/open-sidebar-open-trigger";
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
  SidebarTrigger,
  useSidebar,
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
    name: "Tipos de Entrega",
    url: "/tipos-de-entrega",
    icon: IconTruck,
  },
  {
    name: "Agenda",
    url: "/agenda",
    icon: IconCalendar,
  },

  {
    name: "Disponibilidade",
    url: "/disponibilidade",
    icon: IconCalendarOff,
  },

  {
    name: "Usuários",
    url: "/usuarios",
    icon: IconUsers,
  },
  {
    name: "Fornecedores",
    url: "/fornecedores",
    icon: IconBuilding,
  },

  {
    name: "Configurações",
    url: "/configuracoes",
    icon: IconSettings,
  },
];

export const AdminSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="relative flex-row justify-between items-center">
        <SidebarMenu className="w-fit">
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
        {open && <SidebarTrigger />}
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
