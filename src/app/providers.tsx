"use client";

import { ModalProvider } from "@/components/modals/provider";
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
          <ModalProvider>{children}</ModalProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
