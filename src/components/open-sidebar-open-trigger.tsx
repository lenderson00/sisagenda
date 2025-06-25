"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PanelLeftOpenIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AppSidebarOpenTrigger() {
  const { toggleSidebar, open } = useSidebar();

  if (open) null;

  return (
    <div className={cn("mr-4", open && "hidden")}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="size-7" variant="ghost" onClick={toggleSidebar}>
            <PanelLeftOpenIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={4}
          className="bg-popover border border-border text-popover-foreground"
        >
          Abrir menu
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
