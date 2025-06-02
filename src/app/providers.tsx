"use client";

import { getQueryClient } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
      <Toaster />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
