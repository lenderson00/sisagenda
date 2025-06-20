"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { CornerDownLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useIsMac } from "@/hooks/use-is-mac";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { cn } from "@/lib/utils";

export function CommandMenu({
  tree,
  isIcon = false,
  ...props
}: DialogProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tree: any;
  isIcon?: boolean;
}) {
  const router = useRouter();
  const isMac = useIsMac();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "color" | "page" | "component" | "block" | null
  >(null);
  const [copyPayload, setCopyPayload] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handlePageHighlight = useCallback(
    (isComponent: boolean) => {
      if (isComponent) {
        setSelectedType("component");
      } else {
        setSelectedType("page");
        setCopyPayload("");
      }
    },
    [setSelectedType],
  );

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [copyPayload, runCommand, selectedType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isIcon ? "ghost" : "secondary"}
          className={cn(
            "cursor-pointer bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
            isIcon && "!w-8 !p-0 justify-center ",
          )}
          onClick={() => setOpen(true)}
          {...props}
        >
          {isIcon ? (
            <IconSearch className="size-4" />
          ) : (
            <>
              <span className="inline-flex">Pesquisar...</span>
              <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
                <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
                <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
              </div>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
        <DialogHeader className="sr-only">
          <DialogTitle>Pesquisar documentação...</DialogTitle>
          <DialogDescription>Aprenda a usar o sistema</DialogDescription>
        </DialogHeader>
        <Command className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
          <CommandInput placeholder="Pesquisar documentação..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              Nenhum resultado encontrado.
            </CommandEmpty>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {tree.children.map((group: any) => (
              <CommandGroup
                key={group.$id}
                heading={group.name}
                className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
              >
                {group.type === "folder" &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  group.children.map((item: any) => {
                    if (item.type === "page") {
                      const isComponent = item.url.includes("/components/");

                      return (
                        <CommandMenuItem
                          key={item.url}
                          value={
                            item.name?.toString()
                              ? `${group.name} ${item.name}`
                              : ""
                          }
                          keywords={isComponent ? ["component"] : undefined}
                          onHighlight={() => handlePageHighlight(isComponent)}
                          onSelect={() => {
                            runCommand(() => router.push(item.url));
                          }}
                        >
                          {isComponent ? (
                            <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                          ) : (
                            <IconArrowRight />
                          )}
                          {item.name}
                        </CommandMenuItem>
                      );
                    }
                    return null;
                  })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? "Ir para página"
              : null}
          </div>
          {copyPayload && (
            <>
              <Separator orientation="vertical" className="!h-4" />
              <div className="flex items-center gap-1">
                <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                {copyPayload}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    }
  });

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}
