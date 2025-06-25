"use client";

import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type { PageTree } from "fumadocs-core/source";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DocsBreadcrumb({
  tree,
  className,
}: {
  tree: PageTree;
  className?: string;
}) {
  const pathname = usePathname();
  const items = useBreadcrumb(tree, pathname);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs" className="hover:text-accent-foreground">
              Documentação
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.map((item, index) => (
          <Fragment key={index}>
            {i !== 0 && <BreadcrumbSeparator />}
            {item.url ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={item.url}
                    className="hover:text-accent-foreground truncate"
                  >
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
