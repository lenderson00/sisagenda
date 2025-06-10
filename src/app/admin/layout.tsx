import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TopNavigation } from "@/components/top-navigation";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";
import { Separator } from "@/components/ui/separator";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (


    <SidebarProvider>
      <AdminSidebar/>
      <SidebarInset>

        <div className="flex flex-col">
           <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
              />

          </div>
        </header>
          <div className="min-h-[60vh] bg-neutral-50">{children}</div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
};

export default SuperAdminLayout;
