import { source } from "@/lib/source";
import { DocsSidebar } from "./_components/docs-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { addRolesToPageTree, filterPageTreeByRole } from "@/lib/page-tree";
import { UserRole } from "@prisma/client";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.role) {
    notFound();
  }

  const filteredTree = filterPageTreeByRole(
    source.pageTree,
    session.user.role as UserRole,
  );

  console.log(filteredTree, source.pageTree);

  return (
    <div className="container-wrapper flex flex-1 flex-col px-2">
      <SiteHeader />
      <SidebarProvider className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
        <DocsSidebar tree={filteredTree} />
        <div className="h-full w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}
