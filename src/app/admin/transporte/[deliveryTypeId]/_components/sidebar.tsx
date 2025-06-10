"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <nav
      className={cn(
        "flex space-x-2 flex-row md:space-x-0 md:space-y-1  md:flex-col px-4 md:px-0",
        isMobile && "bg-neutral-100 px-1 py-1 rounded-lg w-full",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href || segments?.includes(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-neutral-100 hover:bg-neutral-100/80 "
                : "hover:bg-transparent text-neutral-500",
              isMobile &&
                isActive &&
                "bg-white shadow-sm hover:bg-white rounded-md",
              "justify-start",
              isMobile && "flex-1 text-center justify-center",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
