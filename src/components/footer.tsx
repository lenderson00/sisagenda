"use client";

import { useUser } from "@/hooks/use-user";
import { Circle } from "lucide-react";
import Link from "next/link";
import { ModeSwitcher } from "./mode-switcher";

const footerLinks = {
  SUPER_ADMIN: [
    {
      name: "Principal",
      href: "/",
    },
    {
      name: "Documentação",
      href: "/docs",
    },
  ],

  FORNECEDOR: [
    {
      name: "Principal",
      href: "/",
    },
  ],

  USER: [
    {
      name: "Principal",
      href: "/",
    },
  ],
};

export default function Footer() {
  const { user } = useUser();

  const links = footerLinks[user?.role as keyof typeof footerLinks] || [];

  return (
    <footer className="border-t bg-background rounded-b-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="w-4 h-4 bg-black"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Status and Theme Controls */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              <span className="text-sm text-emerald-600">Sistema ativo</span>
            </div>

            {/* Theme and External Links */}
            <div className="flex items-center space-x-1">
              <ModeSwitcher />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            © 2025, SisAgenda. Group X - MPI CIANB
          </p>
        </div>
      </div>
    </footer>
  );
}
