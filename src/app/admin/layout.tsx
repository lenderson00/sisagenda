import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="border-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-16px)] relative rounded-lg ">
          <div className="flex flex-col ">
            <div className="min-h-[60vh] bg-background">{children}</div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;
