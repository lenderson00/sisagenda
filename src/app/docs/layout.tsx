import { SidebarProvider } from "@/components/ui/sidebar";
import { RootProvider } from "fumadocs-ui/provider";
import { DocsSidebar } from "@/app/docs/_components/docs-sidebar";
import { source } from "@/lib/source";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
          <div className="container-wrapper flex flex-1 flex-col px-2">

         <SidebarProvider className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
         <DocsSidebar tree={source.pageTree} />
          <div className="h-full w-full">{children}</div>
        </SidebarProvider>
      </div>
    </RootProvider>
  );
}
