import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "jotai";
import { SuperAdminSidebar } from "./_components/super-admin-sidebar";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SidebarProvider>
        <SuperAdminSidebar />
        <SidebarInset className="border-1">
          <div className="flex flex-col ">
            <div className="min-h-[60vh] bg-background">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default SuperAdminLayout;
