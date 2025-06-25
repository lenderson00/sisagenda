"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarDays, List } from "lucide-react";
import { useSupplierView } from "../../_context/view-context";

export function ViewToggle() {
  const { viewMode, toggleView } = useSupplierView();

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => viewMode !== "list" && toggleView()}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Lista</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Visualização em lista</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => viewMode !== "calendar" && toggleView()}
            className="h-8 w-8 p-0"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="sr-only">Calendário</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Visualização em calendário</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
