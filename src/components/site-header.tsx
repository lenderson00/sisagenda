import Link from "next/link";

import { CommandMenu } from "@/components/command-menu";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import { AccountAvatar } from "./account-avatar";
import { Separator } from "./ui/separator";
import { source } from "@/lib/source";
const mockTree = {
  children: [],
};

const mockColors: any[] = [];

export function SiteHeader() {
  const pageTree = source.pageTree;
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center gap-2 md:gap-4">
          <MainNav />
          <MobileNav />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none border rounded-md">
              <CommandMenu tree={pageTree} colors={mockColors} />
            </div>

            <nav className="flex items-center gap-2 ml-4">
              <AccountAvatar className="size-6" />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
