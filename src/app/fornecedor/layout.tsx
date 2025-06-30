import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Provider } from "jotai";
import { FornecedorSidebar } from "./_components/fornecedor-sidebar";
import { NotificationBell } from "@/components/notification-bell";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SidebarProvider>
        <FornecedorSidebar />
        <SidebarInset className="border-1">
          <header className="flex items-center justify-between p-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </header>
          <div className="flex flex-col ">
            <div className="min-h-[60vh] bg-background">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default SuperAdminLayout;
