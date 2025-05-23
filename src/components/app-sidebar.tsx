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
		url: "/admin/usuarios",
		icon: IconUsers,
	},
	{
		name: "Organizações Militares",
		url: "/admin/organizacoes-militares",
		icon: IconBuilding,
	},
];

const navDashboard = [
	{
		name: "Dashboard",
		url: "/admin",
		icon: IconDashboard,
	},
];

const navMain = [
	{
		name: "Agendamentos",
		url: "/admin/agendamentos",
		icon: IconCalendar,
	},
	{
		name: "Fornecedores",
		url: "/admin/fornecedores",
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
				<NavMain items={navDashboard} title="" />
				<NavMain items={adminMain} title="Administração" />
				<NavMain items={navMain} title="Outros" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
