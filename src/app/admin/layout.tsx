import { getUserByEmail } from "@/actions/user";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function Page({ children }: PropsWithChildren) {
	const session = (await auth()) as Session;

	if (!session || !session.user || !session.user.email) {
		redirect("/entrar");
	}

	const actionResult = await getUserByEmail({ email: session.user.email });

	const user = actionResult?.data;

	if (!user) {
		redirect("/entrar");
	}

	return (
		<SidebarProvider>
			<AppSidebar
				user={{
					name: user.name || "",
					email: user.email || "",
					image: user.image || "",
				}}
			/>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						{/* <Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb> */}
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
