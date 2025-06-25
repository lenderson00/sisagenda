"use client";

import { ModalProvider } from "@/components/modals/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

type Props = PropsWithChildren<{
  session: Session;
}>;

export function Providers({ children, session }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <JotaiProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={200} skipDelayDuration={500}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ModalProvider>
                <div vaul-drawer-wrapper="">
                  <div className="relative flex min-h-svh flex-col bg-background">
                    {children}
                  </div>
                </div>
              </ModalProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
