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
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="flex flex-col">
          {/* <TopNavigation tabs={tabs} /> */}
          <div className="min-h-[60vh] bg-neutral-50">{children}</div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;
