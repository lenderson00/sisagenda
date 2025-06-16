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
            <header className="flex h-16 bg-background border-b shrink-0 items-center gap-2 absolute top-0 left-0 right-0 z-50">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </header>
            <div className="min-h-[60vh] pt-16 bg-background">{children}</div>
            {/* <Footer /> */}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;
