import { Button } from "@/components/ui/button";
import { ChevronDown, Circle, Github, Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
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
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Principal
              </Link>
              <Link
                href="/configuracoes"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Configurações
              </Link>

              <div className="flex items-center space-x-1">
                <Link
                  href="/legal"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Legal
                </Link>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
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
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Moon className="w-4 h-4" />
              </Button>
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
