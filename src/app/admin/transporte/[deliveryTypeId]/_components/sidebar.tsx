"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
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
  console.log(segments, pathname);

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 flex-col",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href || segments?.includes(item.href);

        console.log(isActive);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-neutral-200 hover:bg-neutral-200/80 "
                : "hover:bg-transparent text-neutral-500",
              "justify-start",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
