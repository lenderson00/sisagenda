"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    label?: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 sticky top-4 flex-row md:space-x-0 md:space-y-1  md:flex-col px-4 md:px-0",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex justify-between gap-1 w-full items-center",
              isActive
                ? "bg-neutral-100 hover:bg-neutral-100/80 "
                : "hover:bg-transparent text-neutral-500",
            )}
          >
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
