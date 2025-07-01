"use client";

import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
};
export function AccountAvatar({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/entrar" });
  };

  return (
    <div className={cn("relative cursor-pointer", className)} ref={dropdownRef}>
      <button
        type="button"
        className={`bg-primary rounded-full p-1 transition-all duration-200 ${isOpen ? "ring-2 ring-primary/30" : "hover:bg-primary/90"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-full w-full text-primary-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black/5 dark:ring-white/10 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="py-2 px-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium">{user?.name || ""}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              type="button"
              className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
            >
              Meu perfil
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
            >
              Configurações
            </button>
          </div>

          <div className="py-1 border-t border-border">
            <button
              type="button"
              className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-muted transition-colors duration-150"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
