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
  IconDashboard,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

const main = [
  {
    name: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
];

const adminMain = [
  {
    name: "Agendamentos",
    url: "/agendamentos",
    icon: IconCalendar,
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
];

const configMain = [
  {
    name: "Configurações",
    url: "/configuracoes",
    icon: IconSettings,
  },
];

export const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" variant="inset"  {...props}>
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
        <NavMain items={main} title="Principal" className="mt-4" />
        <NavMain items={adminMain} title="Administração" />
        <NavMain items={configMain} title="" className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "John Doe",
            email: "john.doe@example.com",
            image: "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>

    </Sidebar>
  );
};
