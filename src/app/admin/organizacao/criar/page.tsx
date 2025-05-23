import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { OrganizationForm } from "./_components/form";

export default function CreateOrganizationPage() {
	return (
		<div className="container py-8">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/organizations">
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back to Organizations
					</Link>
				</Button>
				<h1 className="text-3xl font-bold tracking-tight">
					Create Organization
				</h1>
				<p className="text-muted-foreground mt-1">
					Add a new organization to the scheduling system
				</p>
			</div>

			<OrganizationForm />
		</div>
	);
}
