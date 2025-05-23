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
	{
		name: "Organizações Militares",
		url: "/oms",
		icon: IconBuilding,
	},
];

const navMain = [
	{
		name: "Dashboard",
		url: "/",
		icon: IconDashboard,
	},
	{
		name: "Agendamentos",
		url: "/agenda",
		icon: IconCalendar,
	},
	{
		name: "Fornecedores",
		url: "/fornecedores",
		icon: IconBuildings,
	},
];

const navConfig = [
	{
		name: "Transporte",
		url: "/transporte",
		icon: IconCar,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} title="Menu Principal" />
				<NavMain items={adminMain} title="Administração" />
				<NavMain items={navConfig} title="Configurações" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
