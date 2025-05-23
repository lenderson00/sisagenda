import { getOrganizations } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
	IconBuildingBridge2,
	IconCalendar,
	IconPlus,
	IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { OrganizationCard } from "./_components/card";

export default async function OrganizationsPage() {
	const organizationsResult = await getOrganizations();

	const organizations = organizationsResult?.data;

	if (!organizations) {
		return <div>Erro ao carregar organizações</div>;
	}

	// Calculate statistics
	const totalOrganizations = organizations.length;
	const activeOrganizations = organizations.filter(
		(org) => org.isActive,
	).length;

	return (
		<div className="container mx-auto">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
					<p className="text-muted-foreground mt-1">
						Manage and view all organizations in the scheduling system
					</p>
				</div>
				<Button asChild>
					<Link href="/organizations/create">
						<IconPlus className="mr-2 h-4 w-4" />
						New Organization
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-card rounded-lg p-4 border">
					<div className="flex items-center gap-2">
						<IconBuildingBridge2 className="h-5 w-5 text-primary" />
						<h3 className="text-sm font-medium">Total Organizations</h3>
					</div>
					<p className="text-2xl font-bold mt-2">{totalOrganizations}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{activeOrganizations} active,{" "}
						{totalOrganizations - activeOrganizations} pending
					</p>
				</div>
			</div>

			{organizations.length === 0 ? (
				<div className="text-center py-12">
					<h2 className="text-xl font-semibold mb-2">No organizations found</h2>
					<p className="text-muted-foreground mb-4">
						Get started by creating your first organization
					</p>
					<Button asChild>
						<Link href="/organizations/create">
							<IconPlus className="mr-2 h-4 w-4" />
							Create Organization
						</Link>
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					{organizations.map((organization) => (
						<OrganizationCard
							key={organization.id}
							organization={organization}
						/>
					))}
				</div>
			)}
		</div>
	);
}
