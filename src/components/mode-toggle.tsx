"use client";

import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Surface className="p-1 gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className="bg-muted dark:bg-transparent"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] " />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className="dark:bg-muted bg-transparent"
      >
        <Moon className="h-[1.2rem] w-[1.2rem] bg-muted/40" />
      </Button>
    </Surface>
  );
}
