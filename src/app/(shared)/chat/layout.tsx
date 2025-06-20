import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { ChatSessionProvider } from "./[id]/_context/session";
import { ChatHeader } from "./_components/chat-header";
import { ChatSidebar } from "./_components/chat-sidebar";

const SuperAdminLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email || !session.user.role) {
    redirect("/entrar");
  }

  if (!["COMIMSUP_ADMIN", "COMRJ_ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="max-h-screen overflow-hidden">
      <ChatHeader className="relative" />
      <SidebarProvider className={"min-h-[calc(100svh-56px)]"}>
        <ChatSidebar />
        <SidebarInset className="border-1 overflow-hidden h-[calc(100svh-80px)]">
          <ScrollArea className="h-[calc(100svh-80px)] relative rounded-lg ">
            <div className="flex flex-col ">
              <header className="flex h-12 bg-background border-b shrink-0 items-center gap-2 absolute top-0 left-0 right-0">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                </div>
              </header>

              <ChatSessionProvider>
                <div className="pt-12 bg-background">{children}</div>
              </ChatSessionProvider>
              {/* <Footer /> */}
            </div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default SuperAdminLayout;
