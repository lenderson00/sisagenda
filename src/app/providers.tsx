"use client";

import { getQueryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	session: Session;
}>;

export const Providers = ({ children, session }: Props) => {
	const queryClient = getQueryClient();

	return (
		<SessionProvider session={session} refetchOnWindowFocus={false}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionProvider>
	);
};
