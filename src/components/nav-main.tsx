"use client";

import type { TablerIcon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
  className,
}: {
  items: {
    name: string;
    url: string;
    icon: TablerIcon;
  }[];
  className?: string;
}) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <SidebarGroup className={cn(className)}>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={cn({
              "text-neutral-500": !isActive(item.url),
              "text-primary": isActive(item.url),
            })}
          >
            <SidebarMenuButton asChild tooltip={item.name}>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
