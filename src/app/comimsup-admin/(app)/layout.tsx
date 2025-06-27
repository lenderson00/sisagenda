import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "jotai";
import { ComimsupAdminSidebar } from "../_components/comimsup-admin-sidebar";

const ComimsupAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SidebarProvider>
        <ComimsupAdminSidebar />
        <SidebarInset className="border-1">
          <div className="flex flex-col ">
            <div className="min-h-[60vh] bg-background">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default ComimsupAdminLayout;
