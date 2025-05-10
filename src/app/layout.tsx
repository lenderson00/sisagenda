import type { Metadata } from "next";
import { Fira_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth/auth";
import type { Session } from "next-auth";
import { Providers } from "./providers";

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
});

const firaMono = Fira_Mono({
	variable: "--font-fira-mono",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Sisgenda",
	description: "Sistema de Agendamento de Entregas",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = (await auth()) as Session;

	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${roboto.variable} ${firaMono.variable} antialiased font-[family-name:var(--font-roboto)]`}
			>
				<Providers session={session}>{children}</Providers>
			</body>
		</html>
	);
}
