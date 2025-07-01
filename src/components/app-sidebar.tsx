"use client";

import type * as React from "react";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconBuilding,
  IconBuildings,
  IconCalendar,
  IconCar,
  IconDashboard,
  IconUsers,
} from "@tabler/icons-react";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: IconDashboard,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: IconDashboard,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: IconDashboard,
      plan: "Free",
    },
  ],
};

const adminMain = [
  {
    name: "Usuários",
    url: "/usuarios",
    icon: IconUsers,
  },
];

const navDashboard = [
  {
    name: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
];

const navMain = [
  {
    name: "Agendamentos",
    url: "/agendamentos",
    icon: IconCalendar,
  },
  {
    name: "Fornecedores",
    url: "/fornecedores",
    icon: IconBuildings,
  },
];

type Props = {
  user: { name: string; email: string; image: string };
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navDashboard} />
        <NavMain items={adminMain} />
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
