import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fira_Mono, Urbanist, Carlito } from "next/font/google";
import { auth } from "@/lib/auth/auth";
import type { Session } from "next-auth";
import { Providers } from "./providers";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  preload: true,
});

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f9fafb",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1C1C1C",
    },
  ],
};

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
        className={`${urbanist.variable} ${firaMono.variable} antialiased font-[family-name:var(--font-urbanist)]`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
