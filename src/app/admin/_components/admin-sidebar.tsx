"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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

export const AdminSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo className="w-10 h-10" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={main} title="" className="mt-4" />
        <NavMain items={adminMain} title="Administração" />
        <NavMain items={configMain} title="Configurações" />
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
      <SidebarRail />
    </Sidebar>
  );
};
