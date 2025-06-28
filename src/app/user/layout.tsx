import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "jotai";
import { UserSidebar } from "./_components/user-sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset className="border-1">
          <div className="flex flex-col ">
            <div className="min-h-[60vh] bg-background">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default UserLayout;
